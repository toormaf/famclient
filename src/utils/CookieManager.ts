export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
  maxAge?: number;
}

export class CookieManager {
  private static defaultOptions: CookieOptions = {
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  };

  static set(name: string, value: any, options: CookieOptions = {}): void {
    const opts = { ...this.defaultOptions, ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      typeof value === 'object' ? JSON.stringify(value) : value
    )}`;

    if (opts.expires) {
      if (typeof opts.expires === 'number') {
        const date = new Date();
        date.setTime(date.getTime() + opts.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${opts.expires.toUTCString()}`;
      }
    }

    if (opts.maxAge) {
      cookieString += `; max-age=${opts.maxAge}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    }

    if (opts.domain) {
      cookieString += `; domain=${opts.domain}`;
    }

    if (opts.secure) {
      cookieString += '; secure';
    }

    if (opts.sameSite) {
      cookieString += `; samesite=${opts.sameSite}`;
    }

    document.cookie = cookieString;
  }

  static get<T = string>(name: string): T | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();

      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length));

        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      }
    }

    return null;
  }

  static getAll(): Record<string, any> {
    const cookies: Record<string, any> = {};
    const cookieStrings = document.cookie.split(';');

    for (let cookie of cookieStrings) {
      const [name, value] = cookie.trim().split('=');
      if (name) {
        try {
          cookies[decodeURIComponent(name)] = JSON.parse(
            decodeURIComponent(value)
          );
        } catch {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      }
    }

    return cookies;
  }

  static remove(name: string, options: CookieOptions = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0),
      maxAge: -1,
    });
  }

  static has(name: string): boolean {
    return this.get(name) !== null;
  }

  static clear(options: CookieOptions = {}): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(name => {
      this.remove(name, options);
    });
  }

  static setPreference(key: string, value: any): void {
    const preferences = this.get<Record<string, any>>('user_preferences') || {};
    preferences[key] = value;
    this.set('user_preferences', preferences, {
      expires: 365,
    });
  }

  static getPreference<T = any>(key: string): T | null {
    const preferences = this.get<Record<string, any>>('user_preferences');
    return preferences ? (preferences[key] as T) : null;
  }

  static removePreference(key: string): void {
    const preferences = this.get<Record<string, any>>('user_preferences');
    if (preferences && key in preferences) {
      delete preferences[key];
      this.set('user_preferences', preferences, {
        expires: 365,
      });
    }
  }

  static getAllPreferences(): Record<string, any> {
    return this.get<Record<string, any>>('user_preferences') || {};
  }

  static clearPreferences(): void {
    this.remove('user_preferences');
  }
}

export default CookieManager;

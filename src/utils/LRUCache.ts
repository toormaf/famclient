class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;
  timestamp: number;
  expiresAt?: number;

  constructor(key: K, value: V, ttl?: number) {
    this.key = key;
    this.value = value;
    this.timestamp = Date.now();
    if (ttl) {
      this.expiresAt = this.timestamp + ttl;
    }
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return Date.now() > this.expiresAt;
  }
}

export interface LRUCacheOptions<K = any, V = any> {
  maxSize?: number;
  ttl?: number;
  onEvict?: (key: K, value: V) => void;
}

export class LRUCache<K = string, V = any> {
  private maxSize: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V> | null = null;
  private tail: LRUNode<K, V> | null = null;
  private ttl?: number;
  private onEvict?: (key: K, value: V) => void;

  constructor(options: LRUCacheOptions<K, V> = {}) {
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl;
    this.onEvict = options.onEvict;
    this.cache = new Map();
  }

  private addToFront(node: LRUNode<K, V>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private removeNode(node: LRUNode<K, V>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private moveToFront(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  private evictLRU(): void {
    if (!this.tail) return;

    const evicted = this.tail;
    this.cache.delete(evicted.key);
    this.removeNode(evicted);

    if (this.onEvict) {
      this.onEvict(evicted.key, evicted.value);
    }
  }

  set(key: K, value: V, customTTL?: number): void {
    const ttl = customTTL || this.ttl;

    if (this.cache.has(key)) {
      const node = this.cache.get(key)!;
      node.value = value;
      node.timestamp = Date.now();
      if (ttl) {
        node.expiresAt = node.timestamp + ttl;
      }
      this.moveToFront(node);
    } else {
      const newNode = new LRUNode(key, value, ttl);

      if (this.cache.size >= this.maxSize) {
        this.evictLRU();
      }

      this.cache.set(key, newNode);
      this.addToFront(newNode);
    }
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) {
      return null;
    }

    const node = this.cache.get(key)!;

    if (node.isExpired()) {
      this.delete(key);
      return null;
    }

    this.moveToFront(node);
    return node.value;
  }

  has(key: K): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    const node = this.cache.get(key)!;
    if (node.isExpired()) {
      this.delete(key);
      return false;
    }

    return true;
  }

  delete(key: K): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    const node = this.cache.get(key)!;
    this.removeNode(node);
    this.cache.delete(key);
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
  }

  size(): number {
    return this.cache.size;
  }

  keys(): K[] {
    return Array.from(this.cache.keys());
  }

  values(): V[] {
    return Array.from(this.cache.values()).map(node => node.value);
  }

  getStats(): {
    size: number;
    maxSize: number;
    oldestKey: K | null;
    newestKey: K | null;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      oldestKey: this.tail?.key || null,
      newestKey: this.head?.key || null,
    };
  }

  cleanup(): void {
    const keysToDelete: K[] = [];

    this.cache.forEach((node, key) => {
      if (node.isExpired()) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }
}

export default LRUCache;

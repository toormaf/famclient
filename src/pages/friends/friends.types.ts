export interface Profile {
  id: string;
  name: string;
  avatar: string;
}

export interface Circle {
  id: string;
  name: string;
  radius: number;
  color: string;
  profiles: Profile[];
  rotation: number;
  targetRotation: number;
  maxVisibleProfiles: number;
}

export const CIRCLE_CONFIG = {
  CLOSE_FRIEND: {
    id: 'close-friend',
    name: 'Close Friend',
    radius: 150,
    color: '#10b981',
    maxVisibleProfiles: 7,
  },
  FRIEND: {
    id: 'friend',
    name: 'Friend',
    radius: 260,
    color: '#f97316',
    maxVisibleProfiles: 12,
  },
  JUST_KNOW: {
    id: 'just-know',
    name: 'Just Know',
    radius: 360,
    color: '#3b82f6',
    maxVisibleProfiles: 18,
  },
};

export const CONFIG = {
  CENTRAL_AVATAR_SIZE: 80,
  PROFILE_AVATAR_SIZE: 55,
  ROTATION_SPEED: 0.05,
  FADE_DURATION: 300,
  ANIMATION_SMOOTHNESS: 0.08,
};

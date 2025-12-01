export type AppPlatform = 'aos' | 'ios';

export interface VersionPolicy {
  platform: AppPlatform;
  latest_version: string;
  minimum_version: string;
  update_message: string | null;
}

export const TAGS = {
  VersionPolicy: 'VersionPolicy',
  User: 'User',
  Product: 'Product',
} as const;

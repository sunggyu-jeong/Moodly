import { AUTH_ICONS } from '@/shared/assets/images/auth';
import type { ImageSourcePropType } from 'react-native';

import { AUTH_PROVIDERS, type AuthProvider } from './types';

type ProviderConfig = {
  label: string;
  backgroundColor: string;
  textColor: string;
  Icon: ImageSourcePropType;
  borderColor?: string;
};

export const AUTH_PROVIDER_CONFIG: Record<AuthProvider, ProviderConfig> = {
  [AUTH_PROVIDERS.GOOGLE]: {
    label: '구글로 시작하기',
    backgroundColor: '#FFFFFF',
    textColor: 'text-black',
    Icon: AUTH_ICONS.google,
    borderColor: '#EEEEF1',
  },
  [AUTH_PROVIDERS.APPLE]: {
    label: '애플로 시작하기',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    Icon: AUTH_ICONS.apple,
  },
};

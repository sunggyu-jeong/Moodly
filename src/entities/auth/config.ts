import { AUTH_ICONS } from '@shared/assets/images/auth';
import { ImageSourcePropType } from 'react-native';
import { AUTH_PROVIDERS, AuthProvider } from './types';

type ProviderConfig = {
  label: string;
  backgroundColor: string;
  textColor: string;
  Icon: ImageSourcePropType;
};

export const AUTH_PROVIDER_CONFIG: Record<AuthProvider, ProviderConfig> = {
  [AUTH_PROVIDERS.GOOGLE]: {
    label: '구글로 시작하기',
    backgroundColor: 'bg-common-white',
    textColor: 'text-black',
    Icon: AUTH_ICONS.google,
  },
  [AUTH_PROVIDERS.APPLE]: {
    label: '애플로 시작하기',
    backgroundColor: 'bg-common-black',
    textColor: 'text-common-white',
    Icon: AUTH_ICONS.apple,
  },
};

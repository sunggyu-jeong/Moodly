import type { ImageSourcePropType } from 'react-native';

import { AUTH_PROVIDERS, AuthProvider } from '@/entities/auth/model/types';
import { AUTH_ICONS } from '@/shared/assets/images/auth';
import { common } from '@/shared/styles/colors';

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
    backgroundColor: common.white,
    textColor: 'text-black',
    Icon: AUTH_ICONS.google,
    borderColor: '#EEEEF1',
  },
  [AUTH_PROVIDERS.APPLE]: {
    label: '애플로 시작하기',
    backgroundColor: common.black,
    textColor: common.white,
    Icon: AUTH_ICONS.apple,
  },
};

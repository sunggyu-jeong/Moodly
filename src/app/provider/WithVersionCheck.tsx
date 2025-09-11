import { CheckVersion } from '@/features/check-app-version';

export const withVersionCheck = Component => props => (
  <>
    <Component {...props} />
    <CheckVersion />
  </>
);

import store from '@/app/store';
import { appApi } from '@/shared/api/AppApi';
import { setLogoutHandler } from '@/shared/lib/logoutBus.util';
import { resetTo } from '@/shared/lib/navigation.util';

export const registerLogoutHandler = () => {
  setLogoutHandler(() => {
    store.dispatch(appApi.util.resetApiState());
    store.dispatch({ type: 'RESET_STORE' });
    resetTo('Login');
  });
};

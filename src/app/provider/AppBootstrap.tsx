import { initUserId, subscribeAuthChanges, unsubscribeAuthChanges } from '@shared/lib/user.util';
import { useEffect } from 'react';

const AppBootstrap = () => {
  useEffect(() => {
    subscribeAuthChanges();
    void initUserId();
    return () => unsubscribeAuthChanges();
  }, []);

  return null;
};

export default AppBootstrap;

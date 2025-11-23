import { useEffect } from 'react';

import { initUserId, subscribeAuthChanges, unsubscribeAuthChanges } from '@/shared/lib/user.util';

const AppBootstrap = () => {
  useEffect(() => {
    subscribeAuthChanges();
    void initUserId();
    return () => unsubscribeAuthChanges();
  }, []);

  return null;
};

export default AppBootstrap;

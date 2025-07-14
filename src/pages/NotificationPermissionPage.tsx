import { useEffect } from 'react';
import { UserMetaDTO } from '../entities/auth/User.scheme';
import { useNotificationPermission } from '../features/notification-permission/model/useNotificationPermission';
import NotificationPermissionPrompt from '../features/notification-permission/ui/NotificationPermission.ui';
import { useSetFirstLoadStatusMutation } from '../shared/api/auth/authApi';
import { resetTo } from '../shared/lib';

const NotificationPermissionPage = () => {
  const { requestNotification, skipPermission } = useNotificationPermission();
  const [setFirstLoadStatus] = useSetFirstLoadStatusMutation();
  const handleAllow = async () => {
    await requestNotification();
    resetTo('Main');
  };

  useEffect(() => {
    return () => {
      const dto: UserMetaDTO = {
        userId: 'local',
        isFirstLoad: false,
        createdAt: new Date(),
      };
      setFirstLoadStatus(dto);
    };
  }, []);

  return (
    <NotificationPermissionPrompt
      onAllow={handleAllow}
      onSkip={skipPermission}
    />
  );
};

export default NotificationPermissionPage;

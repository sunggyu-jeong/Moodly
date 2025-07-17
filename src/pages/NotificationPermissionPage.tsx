import { UserMetaDTO } from '@entities/auth/User.scheme';
import { useNotificationPermission } from '@features/notification-permission/model/useNotificationPermission';
import NotificationPermissionPrompt from '@features/notification-permission/ui/NotificationPermission.ui';
import { useSaveFirstLaunchFlagMutation } from '@shared/api/auth/authApi';
import { resetTo } from '@shared/lib';
import { useEffect } from 'react';

const NotificationPermissionPage = () => {
  const { requestNotification, skipPermission } = useNotificationPermission();
  const [saveFirstLaunchFlag] = useSaveFirstLaunchFlagMutation();
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
      saveFirstLaunchFlag(dto);
    };
  }, [saveFirstLaunchFlag]);

  return (
    <NotificationPermissionPrompt
      onAllow={handleAllow}
      onSkip={skipPermission}
    />
  );
};

export default NotificationPermissionPage;

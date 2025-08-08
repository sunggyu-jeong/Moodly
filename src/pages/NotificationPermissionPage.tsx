import { useNotificationPermission } from '@/shared/hooks/useNotificationPermission';
import { UserMetaDTO } from '@entities/auth/User.scheme';
import NotificationPermissionPrompt from '@features/notification-permission/ui/NotificationPermission.ui';
import { useSaveFirstLaunchFlagMutation } from '@shared/api/auth/authApi';
import { resetTo } from '@shared/lib';
import dayjs from 'dayjs';
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
        createdAt: dayjs().toDate(),
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

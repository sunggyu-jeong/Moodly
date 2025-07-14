import { useNotificationPermission } from '../features/notification-permission/model/useNotificationPermission';
import NotificationPermissionPrompt from '../features/notification-permission/ui/NotificationPermission.ui';

const NotificationPermissionPage = () => {
  const { requestNotification, skipPermission } = useNotificationPermission();
  return (
    <NotificationPermissionPrompt
      onAllow={requestNotification}
      onSkip={skipPermission}
    />
  );
};

export default NotificationPermissionPage;

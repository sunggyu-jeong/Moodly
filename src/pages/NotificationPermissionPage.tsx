import NotificationPermissionUI from "@features/notification-permission/ui/NotificationPermission.ui";
import { resetTo, useNotificationPermission, useSaveFirstLaunchFlagMutation } from "@shared";
import { useEffect } from "react";


const NotificationPermissionPage = () => {
  const { requestNotification, skipPermission } = useNotificationPermission();
  const [saveFirstLaunchFlag] = useSaveFirstLaunchFlagMutation();
  const handleAllow = async () => {
    await requestNotification();
    resetTo('Main');
  };

  useEffect(() => {
    // return () => {
    //   const dto: UserMetaDTO = {
    //     userId: 'local',
    //     isFirstLoad: false,
    //     createdAt: dayjs().toDate(),
    //   };
    //   saveFirstLaunchFlag(dto);
    // };
  }, [saveFirstLaunchFlag]);

  return (
    <NotificationPermissionUI
      onAllow={handleAllow}
      onSkip={skipPermission}
    />
  );
};

export default NotificationPermissionPage;

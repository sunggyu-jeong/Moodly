import { useLogout } from '@features/auth/hooks/useLogout';
import { SETTING_EVENT_TYPE } from '@features/setting/types';
import SettingList from '@features/setting/ui/SettingList';
import { MODAL_CONFIRM_ACTION_KEY } from '@processes/key';
import {
  resetModalPopup,
  setRequestWithDrawal,
  setShowModalPopup,
  setShowToastView,
} from '@processes/overlay/model/overlay.slice';
import { baseApi } from '@shared/api/base';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isEmpty, resetTo } from '@shared/lib';
import { supabase } from '@shared/lib/supabase.util';
import { common, gray } from '@shared/styles/colors';
import NaviTitleDisplay from '@shared/ui/elements/NaviTitle';
import { Label } from '@shared/ui/typography/Label';
import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar';
import { useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';

import { version } from '../../package.json';

const ManageAccountPage = () => {
  const requestWithDrawal = useAppSelector(state => state.overlaySlice.requestWithDrawal);
  const { signOut } = useLogout();
  const dispatch = useAppDispatch();

  const handleAccountDeletion = useCallback(async () => {
    try {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      if (!user.data.user) {
        return;
      }

      const res = await fetch(`${process.env.HOT_UPDATER_SUPABASE_URL}/functions/v1/smart-api`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.data.session?.access_token}`,
        },
        body: JSON.stringify({ userId: user.data.user.id }),
      });

      await res.json();
      if (res.ok) {
        await supabase.auth.signOut();
        dispatch(baseApi.util.resetApiState());
        dispatch(
          setShowToastView({ visibility: true, message: '회원 탈퇴 요청이 완료되었습니다.' }),
        );
        dispatch(setRequestWithDrawal(null));

        resetTo('Login');
      } else {
        dispatch(setShowToastView({ visibility: true, message: '회원 탈퇴 요청이 실패했습니다.' }));
      }
    } catch (err) {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', err);
    } finally {
      dispatch(resetModalPopup());
    }
  }, [dispatch]);

  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      if (identifier === SETTING_EVENT_TYPE.LOG_OUT) {
        signOut();
      } else if (identifier === SETTING_EVENT_TYPE.DELETE_ACCOUNT) {
        dispatch(setRequestWithDrawal(null));
        dispatch(
          setShowModalPopup({
            visibility: true,
            title: '계정 삭제',
            message:
              '삭제 시 모든 기록 정보가 완전히 삭제되며,\n복구가 불가능합니다.\n\n정말 삭제하시겠어요?',
            cancelText: '취소',
            confirmText: '삭제',
            confirmActionKey: MODAL_CONFIRM_ACTION_KEY.WITHDRAWAL,
          }),
        );
      }
    },
    [signOut, dispatch],
  );

  useEffect(() => {
    if (isEmpty(requestWithDrawal)) {
      return;
    }
    handleAccountDeletion();
  }, [requestWithDrawal, handleAccountDeletion]);

  const settingListItems = useMemo(
    () => [
      {
        key: 'log-out',
        title: '로그아웃',
        onPress: () => handlePress(SETTING_EVENT_TYPE.LOG_OUT),
      },
      {
        key: 'delete-account',
        title: '계정 삭제',
        titleStyle: { color: common.red },
        onPress: () => handlePress(SETTING_EVENT_TYPE.DELETE_ACCOUNT),
      },
    ],
    [handlePress],
  );

  return (
    <>
      <NavigationBar
        backgroundColor={gray[100]}
        showBackButton={false}
        centerComponent={<NaviTitleDisplay title={'계정 관리'} />}
      />
      <View className="bg-gray-100 flex-1 justify-between px-4 rounded-xl pt-[14px]">
        <SettingList items={settingListItems} />
        <Label
          weight="regular"
          className="text-gray-400 mb-[13px] text-center"
        >
          {'앱 버전: ' + version}
        </Label>
      </View>
    </>
  );
};

export default ManageAccountPage;

import * as Application from 'expo-application';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useGetUserInfoQuery } from '@/entities/auth/api';
import { MODAL_CONFIRM_ACTION_KEY } from '@/entities/overlay/model/types';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { SETTING_EVENT_TYPE } from '@/features/setting/types';
import ChangeNicknameSheet from '@/features/setting/ui/ChangeNicknameSheet';
import SettingList from '@/features/setting/ui/SettingList';
import { appApi } from '@/shared/api/appApi';
import { SETTING_ICONS } from '@/shared/assets/images/setting';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { resetTo } from '@/shared/lib/navigation.util';
import { supabase } from '@/shared/lib/supabase.util';
import { isEmpty } from '@/shared/lib/value.util';
import {
  resetModalPopup,
  setRequestWithDrawal,
  setShowModalPopup,
  setShowToastView,
} from '@/shared/model/overlaySlice';
import { common, gray } from '@/shared/styles/colors';
import type { BottomSheetHandler } from '@/shared/types/bottomSheet';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { Body1 } from '@/shared/ui/typography/Body1';
import { Label } from '@/shared/ui/typography/Label';

const ManageAccountPage = () => {
  const requestWithDrawal = useAppSelector(state => state.overlay.requestWithDrawal);
  const { signOut } = useLogout();
  const dispatch = useAppDispatch();
  const { data: userInfo } = useGetUserInfoQuery();
  const changeNicknameSheetRef = useRef<BottomSheetHandler>(null);

  const handleAccountDeletion = useCallback(async () => {
    try {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      if (!user.data.user) return;

      const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/smart-api`, {
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
        dispatch(appApi.util.resetApiState());
        dispatch(setRequestWithDrawal(null));
        resetTo('Login');
      } else {
        dispatch(setShowToastView({ visibility: true, message: '회원 탈퇴 요청이 실패했어요.' }));
      }
    } catch (err) {
      console.log('회원 탈퇴 요청 중 오류 발생:', err);
    } finally {
      dispatch(resetModalPopup());
    }
  }, [dispatch]);

  const handlePress = useCallback(
    (identifier: SETTING_EVENT_TYPE) => {
      switch (identifier) {
        case SETTING_EVENT_TYPE.CHANGE_NICKNAME:
          changeNicknameSheetRef.current?.expand();
          break;
        case SETTING_EVENT_TYPE.LOG_OUT:
          signOut();
          break;
        case SETTING_EVENT_TYPE.DELETE_ACCOUNT:
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
          break;
      }
    },
    [signOut, dispatch],
  );

  useEffect(() => {
    if (isEmpty(requestWithDrawal)) return;
    handleAccountDeletion();
  }, [requestWithDrawal, handleAccountDeletion]);

  const settingListItems = useMemo(
    () => [
      [
        {
          key: 'change-nickname',
          title: '닉네임 변경',
          onPress: () => handlePress(SETTING_EVENT_TYPE.CHANGE_NICKNAME),
          rightComponent: (
            <View style={styles.nicknameContainer}>
              <Body1
                weight="regular"
                style={styles.nickname}
              >
                {userInfo?.nickname}
              </Body1>
              <Image
                source={SETTING_ICONS.modifyNickname}
                style={styles.modifyIcon}
                accessibilityLabel="닉네임 변경 아이콘"
              />
            </View>
          ),
        },
      ],
      [
        {
          key: 'log-out',
          title: '로그아웃',
          onPress: () => handlePress(SETTING_EVENT_TYPE.LOG_OUT),
        },
        {
          key: 'delete-account',
          title: '회원 탈퇴',
          titleStyle: { color: common.red },
          onPress: () => handlePress(SETTING_EVENT_TYPE.DELETE_ACCOUNT),
        },
      ],
    ],
    [handlePress, userInfo?.nickname],
  );

  return (
    <>
      <NavigationBar
        backgroundColor={gray[100]}
        showBackButton
        centerComponent={<NaviTitleDisplay title="계정 관리" />}
      />
      <View style={styles.container}>
        <SettingList groups={settingListItems} />
        <Label
          weight="regular"
          style={styles.versionLabel}
        >
          {`앱 버전: ${Application.nativeApplicationVersion ?? '1.0.0'}`}
        </Label>
      </View>
      <ChangeNicknameSheet ref={changeNicknameSheetRef} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[100],
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    borderRadius: 12,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nickname: {
    color: gray[500],
  },
  modifyIcon: {
    width: 24,
    height: 24,
  },
  versionLabel: {
    color: gray[400],
    marginBottom: 13,
    textAlign: 'center',
  },
});

export default ManageAccountPage;

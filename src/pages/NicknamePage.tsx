import { useSetUserInfoMutation } from '@entities/auth/api/auth.api';
import { useUpdateFirstLaunchFlagMutation } from '@entities/auth/api/user-meta.api';
import type { UserInfo } from '@entities/auth/model/auth.types';
import { ActionButton, Caption, H2, resetTo } from '@shared';
import { NavigationBar } from '@widgets/navigation-bar';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';

const MAX_LENGTH = 8;
const NicknamePage = () => {
  const [text, onChangeText] = useState('');
  const [isAvailableNickname, setIsAvailableNickname] = useState(true);
  const [setUserInfoMutation] = useSetUserInfoMutation();
  const [saveFirstLaunchFlag] = useUpdateFirstLaunchFlagMutation();
  const handleSetUserInfo = async () => {
    const userInfo: Pick<UserInfo, 'nickname'> = {
      nickname: text,
    };
    const response = await setUserInfoMutation(userInfo);
    if (response.data) {
      saveFirstLaunchFlag({ isFirstLoad: false });
      resetTo('Main');
    }
  };

  const handleChangeText = (e: string) => {
    onChangeText(e);
    setIsAvailableNickname(e.length < 2);
  };
  return (
    <>
      <NavigationBar />
      <SafeAreaView className="flex-1 h-full bg-common-white">
        <View className="px-5 gap-10 mt-[7px]">
          <H2
            weight="semibold"
            style={Styles.nicknameStyle}
          >
            사용하실 닉네임을 알려주세요.
          </H2>
          <View className="w-full h-[60px] rounded-xl border-gray-200 border-b bg-gray-100">
            <TextInput
              className="w-full h-[60px] ml-[26px]"
              onChangeText={handleChangeText}
              value={text}
              maxLength={MAX_LENGTH}
            />
            <Caption
              weight="regular"
              style={Styles.textLengthStyle}
            >
              {`${text.length}/${MAX_LENGTH}`}
            </Caption>
          </View>
        </View>
        <View className="absolute bottom-12 w-full items-center gap-3 px-5">
          <ActionButton
            disabled={isAvailableNickname}
            onPress={handleSetUserInfo}
          >
            다음
          </ActionButton>
        </View>
      </SafeAreaView>
    </>
  );
};

const Styles = StyleSheet.create({
  nicknameStyle: {
    textAlign: 'left',
  },
  textLengthStyle: {
    textAlign: 'right',
    marginRight: 10,
  },
});

export default NicknamePage;

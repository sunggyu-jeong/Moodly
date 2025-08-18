import dayjs from 'dayjs';
import { useState } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { UserMetaDTO } from '../entities/auth/User.scheme';
import {
  useSaveFirstLaunchFlagMutation,
  useSetUserInfoMutation,
  type UserInfo,
} from '../shared/api/auth/authApi';
import { useAppDispatch } from '../shared/hooks';
import { resetTo } from '../shared/lib';
import ActionButton from '../shared/ui/elements/ActionButton';
import { Caption } from '../shared/ui/typography/Caption';
import { H2 } from '../shared/ui/typography/H2';
import NavigationBar from '../widgets/navigation-bar/ui/NavigationBar';

const MAX_LENGTH = 8;
const NicknamePage = () => {
  const dispatch = useAppDispatch();
  const [text, onChangeText] = useState('');
  const [isAvailableNickname, setIsAvailableNickname] = useState(true);
  const [setUserInfoMutation] = useSetUserInfoMutation();
  const [saveFirstLaunchFlag] = useSaveFirstLaunchFlagMutation();
  const handleSetUserInfo = async () => {
    const userInfo: Pick<UserInfo, 'nickname'> = {
      nickname: text,
    };
    const response = await setUserInfoMutation(userInfo);
    if (response.data) {
      const dto: UserMetaDTO = {
        userId: 'local',
        isFirstLoad: false,
        createdAt: dayjs().toDate(),
      };
      saveFirstLaunchFlag(dto);
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
            style={{ textAlign: 'left' }}
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
              style={{ textAlign: 'right', marginTop: 10 }}
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

export default NicknamePage;

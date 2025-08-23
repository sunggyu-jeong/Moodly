import { useSetUserInfoMutation } from '@entities/auth/api/auth.api';
import { useUpdateFirstLaunchFlagMutation } from '@entities/auth/api/user-meta.api';
import type { UserInfo } from '@entities/auth/model/auth.types';
import { ActionButton } from '@shared';
import { InputWithCounterProps } from '@shared/ui/elements/InputWithCounter';
import { useState } from 'react';
import { View } from 'react-native';

const MAX_LENGTH = 8;

interface SetNicknameFormProps {
  inputBackgroundColor?: string;
  onSuccess: () => void;
}

export const SetNicknameForm = ({ onSuccess, inputBackgroundColor }: SetNicknameFormProps) => {
  const [nickname, setNickname] = useState('');
  const isSubmittable = nickname.length >= 2;

  const [setUserInfoMutation, { isLoading: isSettingUser }] = useSetUserInfoMutation();
  const [saveFirstLaunchFlag, { isLoading: isSavingFlag }] = useUpdateFirstLaunchFlagMutation();

  const handleSubmit = async () => {
    if (!isSubmittable) return;

    const userInfo: Pick<UserInfo, 'nickname'> = { nickname };
    const response = await setUserInfoMutation(userInfo);

    if (response.data) {
      await saveFirstLaunchFlag({ isFirstLoad: false });
      onSuccess();
    }
  };

  return (
    <View className="w-full px-9 flex-1 justify-between">
      <InputWithCounterProps
        value={nickname}
        onChangeText={setNickname}
        inputBackgroundColor={inputBackgroundColor}
        maxLength={MAX_LENGTH}
        placeholder="닉네임을 입력해주세요."
      />
      <ActionButton
        disabled={!isSubmittable || isSettingUser || isSavingFlag}
        onPress={handleSubmit}
      >
        {inputBackgroundColor ? '완료' : '다음'}
      </ActionButton>
    </View>
  );
};

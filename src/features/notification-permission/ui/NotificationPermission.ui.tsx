import { MAIN_ICONS } from '@shared/assets/images/main';
import { gray } from '@shared/styles/colors';
import ActionButton from '@shared/ui/elements/ActionButton';
import { Body1 } from '@shared/ui/typography/Body1';
import { Body2 } from '@shared/ui/typography/Body2';
import { Title } from '@shared/ui/typography/Title';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  onAllow: () => void;
  onSkip: () => void;
}

const NotificationPermissionUI = ({ onAllow, onSkip }: Props) => (
  <View className="flex-1 h-full bg-common-white">
    <View className="flex-1 items-center justify-center pb-20">
      <Image
        source={MAIN_ICONS.permission}
        className="w-[297px] h-[257px] mb-11"
        resizeMode="contain"
      />
      <View className="items-center gap-4">
        <Title
          size={27}
          weight="semibold"
          style={styles.title}
        >
          {'기록을 잊지 않도록\n알려드릴게요.'}
        </Title>
        <Body1
          weight="regular"
          style={styles.body}
        >
          {'하루의 감정은 금방 지나가요.\n그 순간을 놓치지 않도록 알려드릴게요.'}
        </Body1>
      </View>
    </View>

    <View className="absolute bottom-12 w-full items-center gap-3 px-5">
      <ActionButton onPress={onAllow}>알림 설정하기</ActionButton>
      <Body2
        weight="semibold"
        className="text-gray-400"
        onPress={onSkip}
      >
        나중에 하기
      </Body2>
    </View>
  </View>
);

const styles = StyleSheet.create({
  body: { color: gray[400], lineHeight: 24, textAlign: 'center' },
  title: { lineHeight: 40, textAlign: 'center' },
});

export default NotificationPermissionUI;

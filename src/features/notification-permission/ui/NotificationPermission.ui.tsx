import { MAIN_ICONS } from '@/shared/assets/images/main';
import { gray } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { Body1 } from '@/shared/ui/typography/Body1';
import { Body2 } from '@/shared/ui/typography/Body2';
import { Title } from '@/shared/ui/typography/Title';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  onAllow: () => void;
  onSkip: () => void;
}

const NotificationPermissionUI = ({ onAllow, onSkip }: Props) => (
  <View style={styles.container}>
    <View style={styles.contentWrapper}>
      <Image
        source={MAIN_ICONS.permission}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textWrapper}>
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

    <View style={styles.bottomWrapper}>
      <ActionButton onPress={onAllow}>알림 설정하기</ActionButton>
      <Body2
        weight="semibold"
        style={styles.skipText}
        onPress={onSkip}
      >
        나중에 하기
      </Body2>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  image: {
    width: 297,
    height: 257,
    marginBottom: 44,
  },
  textWrapper: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    lineHeight: 40,
    textAlign: 'center',
  },
  body: {
    color: gray[400],
    lineHeight: 24,
    textAlign: 'center',
  },
  bottomWrapper: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    color: gray[400],
  },
});

export default NotificationPermissionUI;

import { UpdateContent } from '@features/update-progress/updateProgress';
import { primary } from '@shared';
import { MAIN_ICONS } from '@shared/assets/images/main';
import { Image, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

type CustomStatus = 'checking' | 'downloading' | 'installing' | 'error';

type HotUpdaterStatus = 'CHECK_FOR_UPDATE' | 'UPDATING';

interface FallbackProps {
  status: HotUpdaterStatus;
  progress: number;
  message: string | null;
}

const mapStatus = (status: HotUpdaterStatus): CustomStatus => {
  switch (status) {
    case 'CHECK_FOR_UPDATE':
      return 'checking';
    case 'UPDATING':
      return 'downloading';
    default:
      return 'checking';
  }
};

const UPDATE_CONTENT_MAP: Record<
  CustomStatus,
  { title: string; subtitle?: string; progressLabel: string }
> = {
  checking: {
    title: '새 버전이 있는지 확인 중…',
    subtitle: '잠깐만 기다려 주세요.',
    progressLabel: '확인 중...',
  },
  downloading: {
    title: '앱을 업데이트하는 중이에요.',
    subtitle: '새로운 기능들을 준비하고 있어요!',
    progressLabel: '다운로드 중...',
  },
  installing: {
    title: '업데이트 설치 완료!',
    subtitle: '앱을 재시작합니다.',
    progressLabel: '재시작 중...',
  },
  error: {
    title: '오류가 발생했어요.',
    subtitle: '네트워크 연결을 확인하고 앱을 다시 시작해주세요.',
    progressLabel: '실패',
  },
};

const FallbackUI = ({ status, progress }: FallbackProps) => {
  const customStatus = mapStatus(status);
  const { title, subtitle, progressLabel } = UPDATE_CONTENT_MAP[customStatus];

  return (
    <>
      <StatusBar
        translucent
        barStyle="dark-content"
      />
      <SafeAreaView style={styles.contentView}>
        <View style={styles.imageView}>
          <Image source={MAIN_ICONS.logo} />
        </View>

        <View style={styles.itemView}>
          <UpdateContent
            title={title}
            subtitle={subtitle}
            progress={progress}
            progressLabel={progressLabel}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primary[300],
  },
  imageView: {
    position: 'absolute',
  },
  itemView: {
    position: 'absolute',
    bottom: 48,
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
});

export default FallbackUI;

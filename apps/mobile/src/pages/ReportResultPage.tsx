import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AI_ICONS } from '@/shared/assets/images/ai-report';
import { gray } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { H1 } from '@/shared/ui/typography/H1';
import { Label } from '@/shared/ui/typography/Label';

const ReportResultPage = () => {
  const insets = useSafeAreaInsets();
  const handlePressButton = () => {};
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Image
          source={AI_ICONS.iconReportSuccess}
          alt="주간 리포트 도착"
          style={{ width: 150, height: 150 }}
        />
        <H1 weight="semibold">주간 리포트 도착</H1>
        <Label
          weight="regular"
          style={{ color: gray[400], textAlign: 'center' }}
        >
          {`이번 주 일기를 분석하여\n감정 리포트를 작성했어요!`}
        </Label>
      </View>

      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: insets.bottom + 17,
          gap: 8,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <ActionButton onPress={handlePressButton}>보러가기</ActionButton>
        <ActionButton
          disabled
          onPress={handlePressButton}
        >
          보러가기
        </ActionButton>
      </View>
    </View>
  );
};

export default ReportResultPage;

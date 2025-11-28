import { useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWeeklyReportCheck } from '@/features/ai-report/hooks/useWeeklyReport';
import { AI_ICONS } from '@/shared/assets/images/ai-report';
import { ColorKeyEnum, getColor } from '@/shared/constants/colors';
import { dismissModalToScreen } from '@/shared/lib/navigation.util';
import { common, gray } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { H1 } from '@/shared/ui/typography/H1';
import { Label } from '@/shared/ui/typography/Label';

const REPORT_UI_CONFIG = {
  success: {
    icon: AI_ICONS.iconReportSuccess,
    title: '주간 리포트 도착',
    desc: '이번 주 일기를 분석하여\n감정 리포트를 작성했어요!',
    primaryButtonText: '보러가기',
  },
  failure: {
    icon: AI_ICONS.iconReportFail,
    title: '리포트 작성 실패..',
    desc: '리포트 작성 조건을 충족하지 못했어요\n다음주는 열심히 작성해봐요!',
    primaryButtonText: '확인',
  },
};

const ReportResultPage = () => {
  const insets = useSafeAreaInsets();
  const { hasReport } = useWeeklyReportCheck();

  const uiState = useMemo(
    () => (hasReport ? REPORT_UI_CONFIG.success : REPORT_UI_CONFIG.failure),
    [hasReport],
  );

  const handlePressButton = (isDismiss: Boolean) => {
    if (hasReport) {
      console.log(isDismiss);
    } else {
      dismissModalToScreen();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image
          source={uiState.icon}
          alt="주간 리포트"
          style={styles.icon}
        />
        <H1 weight="semibold">{uiState.title}</H1>
        <Label
          weight="regular"
          style={styles.description}
        >
          {uiState.desc}
        </Label>
      </View>

      <View style={[styles.bottomContainer, { bottom: insets.bottom + 17 }]}>
        <ActionButton onPress={() => handlePressButton(false)}>
          {uiState.primaryButtonText}
        </ActionButton>

        {hasReport && (
          <ActionButton
            style={{ backgroundColor: getColor(ColorKeyEnum.Disabled) }}
            onPress={() => handlePressButton(true)}
          >
            다음에 볼게요
          </ActionButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: common.white,
  },
  centerContent: {
    gap: 8,
    alignItems: 'center',
  },
  icon: {
    width: 150,
    height: 150,
  },
  description: {
    color: gray[400],
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomContainer: {
    position: 'absolute',
    width: '100%',
    gap: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default ReportResultPage;

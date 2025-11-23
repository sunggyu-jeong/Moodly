import dayjs from 'dayjs';
import { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useAppSelector } from '@/app/store';
import { useGetAIReportQuery } from '@/entities/ai-report/api';
import { EMOTION_ICON_MAP } from '@/entities/ai-report/model/constants';
import { FormattedTextSection } from '@/entities/ai-report/ui/FormattedTextSection';
import { domainToUIStats } from '@/features/ai-report/model/mapper';
import ChooseReportSheet from '@/features/ai-report/ui/ChooseReportSheet';
import { CoreKeywordsList } from '@/features/ai-report/ui/CoreKeywordsLIst';
import { EmotionDistribution } from '@/features/ai-report/ui/EmotionDistribution';
import { ReflectionList } from '@/features/ai-report/ui/ReflectionList';
import { ReportSection } from '@/features/ai-report/ui/ReportSection';
import { WeeklyKeywordBubbleChart } from '@/features/ai-report/ui/WeeklyKeywordBubbleChart';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import useDelay from '@/shared/hooks/useDelay';
import { gray } from '@/shared/styles/colors';
import type { BottomSheetHandler } from '@/shared/types/bottomSheet';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { H2 } from '@/shared/ui/typography/H2';

const AIReportPage = () => {
  const { isLoading } = useGetAIReportQuery();
  const aiSheetRef = useRef<BottomSheetHandler>(null);
  const reportDates = useAppSelector(state => state.aiReport.reportDates);
  const selectedReport = useAppSelector(state => state.aiReport.selectedReport);
  const delayedLoading = useDelay(isLoading);

  const handleChooseReport = useCallback(() => {
    aiSheetRef.current?.expand();
  }, []);

  const renderHeaderCenter = () => (
    <TouchableWithoutFeedback>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handleChooseReport}
          style={{ display: 'flex', flexDirection: 'row' }}
        >
          <NaviTitleDisplay
            title={`${dayjs(selectedReport?.date).format('MM월 DD일')} 리포트`}
            style={styles.naviTitle}
          />
        </TouchableOpacity>
        <Image
          source={COMMON_ICONS.iconDown}
          alt="날짜 선택"
        />
      </View>
    </TouchableWithoutFeedback>
  );

  console.log('@!>$>!>$@>$>@!', delayedLoading, selectedReport);

  if (delayedLoading || !selectedReport) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator
          size="large"
          color={gray[400]}
        />
      </View>
    );
  }

  const emotionStats = domainToUIStats(selectedReport.emotion_distribution, EMOTION_ICON_MAP);

  return (
    <>
      <View style={styles.container}>
        <NavigationBar
          showBackButton={false}
          centerComponent={renderHeaderCenter()}
        />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <H2
            weight="semibold"
            style={styles.title}
          >
            {selectedReport.date}
          </H2>

          {/* 1. 기분 분포 */}
          <ReportSection title="기분 분포">
            <EmotionDistribution stats={emotionStats} />
          </ReportSection>

          {/* 2. 이번 주 키워드 (Previously Refactored) */}
          <ReportSection title="이번 주 키워드">
            <WeeklyKeywordBubbleChart items={selectedReport.weekly_keywords} />
          </ReportSection>

          {/* 3. 감정 여정 요약 */}
          <ReportSection title="🪞 감정 여정 요약">
            <FormattedTextSection text={selectedReport.summary} />
          </ReportSection>

          {/* 4. 핵심 내면 키워드 */}
          <ReportSection title="🧠 핵심 내면 키워드 3가지">
            <CoreKeywordsList items={selectedReport.core_inner_keywords} />
          </ReportSection>

          {/* 5. 자기 성찰 질문지 */}
          <ReportSection title="🪴 자기 성찰 질문지">
            <ReflectionList questions={selectedReport.self_reflection_questions} />
          </ReportSection>

          {/* 6. 무들리가 전하고 싶은 말 */}
          <ReportSection title="🌱 무들리가 전하고 싶은 말">
            <FormattedTextSection text={selectedReport.message_from_moodly} />
          </ReportSection>
        </ScrollView>
      </View>
      <ChooseReportSheet
        ref={aiSheetRef}
        dates={reportDates}
        selectedDate={selectedReport.date}
        onSelect={date => {
          console.log('선택된 날짜:', date);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    flexDirection: 'row',
  },
  naviTitle: {
    color: gray[400],
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  title: {
    marginTop: 10,
  },
});

export default AIReportPage;

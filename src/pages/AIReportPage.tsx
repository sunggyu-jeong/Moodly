import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useGetAIReportByDateMockQuery } from '@/entities/ai-report/api';
import { EMOTION_ICON_MAP } from '@/entities/ai-report/model/constants';
import { domainToUIStats } from '@/features/ai-report/model/mapper';
import { ReportSection } from '@/features/ai-report/ui/ReportSection';
import { WeeklyKeywordBubbleChart } from '@/features/ai-report/ui/WeeklyKeywordBubbleChart';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { gray } from '@/shared/styles/colors';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { Body1 } from '@/shared/ui/typography/Body1';
import { Caption } from '@/shared/ui/typography/Caption';
import { H2 } from '@/shared/ui/typography/H2';

const PAGE_DATE = '2025-10-05';

const AIReportPage = () => {
  const { data, isLoading } = useGetAIReportByDateMockQuery(PAGE_DATE);

  const centerComponents = () => (
    <TouchableWithoutFeedback>
      <View style={styles.navigationContainer}>
        <NaviTitleDisplay
          title={'10월 5일 리포트'}
          style={styles.naviTitle}
        />
        <Image
          source={COMMON_ICONS.iconDown}
          alt="다운 아이콘"
        />
      </View>
    </TouchableWithoutFeedback>
  );

  if (isLoading || !data) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  const splitToParagraphs = (text: string): string[] => {
    if (!text.includes('. ')) {
      return [text];
    }

    const parts = text.split('. ');

    return parts
      .map((part, idx) => (idx === parts.length - 1 ? part.trim() : `${part.trim()}.`))
      .filter(Boolean);
  };

  const stats = domainToUIStats(data.emotion_distribution, EMOTION_ICON_MAP);
  return (
    <View style={styles.container}>
      <NavigationBar
        showBackButton={false}
        centerComponent={centerComponents()}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <H2
          weight="semibold"
          style={styles.title}
        >
          {data.title}
        </H2>

        <ReportSection title="기분 분포">
          <View
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}
          >
            {stats.map(stat => (
              <View
                key={stat.key}
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <Image
                  style={{ width: 38, height: 38 }}
                  source={stat.icon}
                />
                <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
                  <Caption
                    weight="semibold"
                    style={{ padding: 3, color: gray[400], textAlign: 'center' }}
                  >
                    {`${stat.percent}%`}
                  </Caption>
                </View>
              </View>
            ))}
          </View>
        </ReportSection>

        <ReportSection title="이번 주 키워드">
          <WeeklyKeywordBubbleChart items={data.weekly_keywords} />
        </ReportSection>

        <ReportSection title="🪞 감정 여정 요약">
          {splitToParagraphs(data.summary).map((el, idx) => (
            <Body1
              key={idx}
              weight="regular"
              style={{
                color: gray[500],
                lineHeight: 28,
                marginBottom: idx === splitToParagraphs(data.summary).length - 1 ? 0 : 14,
              }}
            >
              {el}
            </Body1>
          ))}
        </ReportSection>

        <ReportSection title="🧠 핵심 내면 키워드 3가지">
          {data.core_inner_keywords.map((el, idx) => {
            const isLast = idx === data.core_inner_keywords.length - 1;

            return (
              <View
                key={idx}
                style={{ gap: 2 }}
              >
                <Body1
                  weight="semibold"
                  style={{ color: gray[500], lineHeight: 28 }}
                >
                  {el.title}
                </Body1>

                <Body1
                  weight="regular"
                  style={{
                    color: gray[500],
                    lineHeight: 28,
                    marginBottom: isLast ? 0 : 16,
                  }}
                >
                  {el.message}
                </Body1>
              </View>
            );
          })}
        </ReportSection>

        <ReportSection title="🪴 자기 성찰 질문지">
          {data.self_reflection_questions.map((el, idx) => {
            const isLast = idx === data.self_reflection_questions.length - 1;
            return (
              <View
                key={idx}
                style={{ marginBottom: isLast ? 0 : 14 }}
              >
                <Body1
                  weight="regular"
                  style={{
                    color: gray[500],
                    lineHeight: 28,
                  }}
                >
                  {`· ${el}`}
                </Body1>
              </View>
            );
          })}
        </ReportSection>

        <ReportSection title="🌱 무들리가 전하고 싶은 말">
          {splitToParagraphs(data.message_from_moodly).map((el, idx) => (
            <Body1
              key={idx}
              weight="regular"
              style={{
                color: gray[500],
                lineHeight: 28,
                marginBottom:
                  idx === splitToParagraphs(data.message_from_moodly).length - 1 ? 0 : 14,
              }}
            >
              {el}
            </Body1>
          ))}
        </ReportSection>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    flexDirection: 'row',
  },
  container: { width: '100%', height: '100%' },
  center: { justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { backgroundColor: 'white', width: '100%', height: '100%' },
  scrollContent: { alignItems: 'flex-start', justifyContent: 'flex-start', padding: 20, gap: 20 },
  title: { marginTop: 10 },
  naviTitle: { color: gray[400] },
});

export default AIReportPage;

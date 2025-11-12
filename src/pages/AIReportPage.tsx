import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useGetAIReportByDateMockQuery } from '@/entities/ai-report/api';
import { ReportSection } from '@/features/ai-report/ui/ReportSection';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { EMOTION_ICONS } from '@/shared/assets/images/emotion';
import { gray } from '@/shared/styles/colors';
import NavigationBar from '@/shared/ui/elements/navigation/NavigationBar';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
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
            <View style={{ flex: 1, flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <Image
                style={{ width: 38, height: 38 }}
                source={EMOTION_ICONS.anxietySmallSelected}
              />
              <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
                <Caption
                  weight="semibold"
                  style={{ margin: 4, color: gray[400], textAlign: 'center' }}
                >
                  40%
                </Caption>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <Image
                style={{ width: 38, height: 38 }}
                source={EMOTION_ICONS.anxietySmallSelected}
              />
              <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
                <Caption
                  weight="semibold"
                  style={{ margin: 4, color: gray[400], textAlign: 'center' }}
                >
                  40%
                </Caption>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <Image
                style={{ width: 38, height: 38 }}
                source={EMOTION_ICONS.anxietySmallSelected}
              />
              <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
                <Caption
                  weight="semibold"
                  style={{ margin: 4, color: gray[400], textAlign: 'center' }}
                >
                  40%
                </Caption>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <Image
                style={{ width: 38, height: 38 }}
                source={EMOTION_ICONS.anxietySmallSelected}
              />
              <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
                <Caption
                  weight="semibold"
                  style={{ margin: 4, color: gray[400], textAlign: 'center' }}
                >
                  5%
                </Caption>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <Image
                style={{ width: 38, height: 38 }}
                source={EMOTION_ICONS.anxietySmallSelected}
              />
              <View style={{ backgroundColor: gray[200], borderRadius: 6 }}>
                <Caption
                  weight="semibold"
                  style={{ margin: 4, color: gray[400], textAlign: 'center' }}
                >
                  40%
                </Caption>
              </View>
            </View>
          </View>
        </ReportSection>

        <ReportSection title="이번 주 키워드"></ReportSection>

        <ReportSection title="🪞 감정 여정 요약"></ReportSection>

        <ReportSection title="🧠 핵심 내면 키워드 3가지"></ReportSection>

        <ReportSection title="🪴 자기 성찰 질문지"></ReportSection>

        <ReportSection title="🌱 무들리가 전하고 싶은 말">
          <Text style={styles.body}>{data.message_from_moodly}</Text>
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
  body: { color: gray[500], lineHeight: 22 },
});

export default AIReportPage;

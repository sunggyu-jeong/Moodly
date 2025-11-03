import React, { useMemo, useState, useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View, Button, ViewStyle } from 'react-native';
import { useGetDiariesByRangeQuery } from '@/entities/diary/api';
import { Diary } from '@/entities/diary/model/diary.types';
import { EmotionDiaryCardList, EmotionDiaryListEmpty } from '@/features/diary';
import { ActionButton, H3, useDelay } from '@/shared';
import NaviTitleDisplay from '@/shared/ui/elements/NaviTitle';
import { NavigationBar } from '@/widgets/navigation-bar';
import LoadingOverlay from '@/pages/LoadingOverlay';

type ListItem = { type: 'DIARY'; data: Diary };

const DiaryAITestPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [run, { data: response }] = useGenerateWeeklySummaryMutation();

  const { data, isFetching } = useGetDiariesByRangeQuery(
    { start: '1970-01-01', end: '2030-01-01' },
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
      selectFromResult: ({ data, isFetching }) => ({
        data,
        isFetching,
        listData: data ?? [],
      }),
    },
  );

  const listData: ListItem[] = useMemo(
    () => (data ?? []).map(d => ({ type: 'DIARY' as const, data: d })),
    [data],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isDelayedLoading = useDelay(isFetching);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isActionEnabled = selectedIds.size === 7;
  const selectedDiaries = useMemo(
    () => listData.filter(li => selectedIds.has(li.data.id)).map(li => li.data),
    [listData, selectedIds],
  );

  const handleAction = useCallback(() => {
    setIsLoading(true);
    try {
      //fixme - api 요청해서 응답결과 뿌려줄것!
      console.log(
        'selected(7):',
        selectedDiaries.map(d => d.id),
      );
      await run({
        model: 'gemini-2.5-flash',
        temperature: 0.3,
        max_tokens: 2500,
        response_mime_type: 'application/json',
        //FIXME: - response_schema 변경하기.
        response_schema: null,
        safety_settings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
        ],
        messages: [
          {
            role: 'system',
            content:
              '당신은 대한민국의 전문 심리상담사입니다. 다음 절대 규칙을 준수하세요. 1) 출력은 오직 하나의 JSON 객체, 코드블록/마크다운/텍스트 금지. 2) 제공된 JSON 스키마의 모든 필드 필수. 3) 진단·치료·약물 언급 금지. 4) 질문형 문장은 self_reflection_questions에서만 허용. 5) emotion_distribution 합계=100. 6) 총 분량은 최소 800자. 7) 일별/요일별 기술 금지, 오직 ‘한 주간 통합’ 결과만 서술.',
          },
          {
            role: 'user',
            content:
              '[FACT INPUT]\n월요일: 업무 시작이 버겁고 집중이 잘 안 되었다. 하루 종일 피곤하고 예민했다.\n목요일: 작은 실수 때문에 자책했다. 불안한 생각이 많았다.\n토요일: 혼자 있는 시간이 많아 외로웠지만, 음악을 들으며 위로받았다.\n일요일: 한 주를 돌아보며 여전히 불안하지만 조금씩 회복되고 있음을 느꼈다.\n\n위 기록을 바탕으로 한 주간의 감정 흐름을 통합 분석하고, 위 JSON 스키마에 정확히 따라 오직 하나의 JSON 객체로만 출력하세요.',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDiaries]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      const id = item.data.id;
      const selected = selectedIds.has(id);
      return (
        <Pressable
          onPress={() => toggleSelect(id)}
          style={[styles.cardWrapper, selected && styles.cardSelected]}
        >
          <EmotionDiaryCardList data={item.data} />
        </Pressable>
      );
    },
    [selectedIds, toggleSelect],
  );

  const keyExtractor = useCallback((item: ListItem) => item.data.id, []);

  return (
    <>
      <NavigationBar centerComponent={<NaviTitleDisplay title="일기 목록 조회" />} />
      <View style={styles.container}>
        <FlatList<ListItem>
          style={styles.list}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.scrollViewContent}
          ListEmptyComponent={isDelayedLoading ? null : <EmotionDiaryListEmpty />}
          initialNumToRender={12}
          extraData={selectedIds}
        />
        <View
          style={[styles.actionBar, !isActionEnabled && (styles.actionBarDisabled as ViewStyle)]}
        >
          <ActionButton
            onPress={handleAction}
            disabled={isActionEnabled}
          >
            <H3>7개 선택되면 활성화대여!</H3>
          </ActionButton>
        </View>
      </View>
      <LoadingOverlay visible={isApiLoading} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  scrollViewContent: { padding: 16, paddingBottom: 88 },
  cardWrapper: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  cardSelected: {
    borderColor: '#4F46E5',
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionBarDisabled: {
    opacity: 0.6,
  },
});

export default DiaryAITestPage;

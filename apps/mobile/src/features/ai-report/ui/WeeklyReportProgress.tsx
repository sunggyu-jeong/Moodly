import { Image, StyleSheet, View } from 'react-native';

import type { WeeklyProgressProps } from '@/features/ai-report/model/types';
import { COMMON_ICONS } from '@/shared/assets/images/common';
import { MAIN_ICONS } from '@/shared/assets/images/main';
import { gray, primary } from '@/shared/styles/colors';
import ActionButton from '@/shared/ui/elements/ActionButton';
import { Body2 } from '@/shared/ui/typography/Body2';
import { H2 } from '@/shared/ui/typography/H2';

export const WeeklyReportProgress = ({
  isFirst,
  totalDays,
  doneDays,
  remainDays,
  onConfirm,
}: WeeklyProgressProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={MAIN_ICONS.avatar} />
        <H2>{'오늘도 기록 완료!'}</H2>

        <View style={styles.ment}>
          <Body2 style={{ color: gray[400] }}>{isFirst ? '앞으로 ' : '리포트까지 이제 '}</Body2>
          <Body2 style={[{ color: primary[300] }, styles.num]}>{remainDays}</Body2>
          <Body2 style={{ color: gray[400] }}>
            {isFirst ? '일 더 기록하면 리포트를 받을 수 있어요!' : '일 남았어요!'}
          </Body2>
        </View>

        <View style={styles.checkIcons}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
            {Array.from({ length: totalDays }).map((_, idx) => {
              const checked = idx < doneDays;
              return (
                <View
                  key={idx}
                  style={{ alignItems: 'center' }}
                >
                  <Image source={checked ? COMMON_ICONS.iconChecked : COMMON_ICONS.iconUnchecked} />
                  <Body2
                    style={{
                      color: checked ? primary[300] : gray[400],
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    {idx + 1}
                  </Body2>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <ActionButton
        style={styles.button}
        onPress={onConfirm}
      >
        <Body2
          weight="regular"
          style={styles.subtitle}
        >
          확인
        </Body2>
      </ActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: 'white',
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  num: { marginHorizontal: 0, textAlign: 'right' },
  ment: { flexDirection: 'row', alignItems: 'center' },
  checkIcons: { flexDirection: 'row', gap: 8, marginTop: 40 },
  button: { position: 'absolute', bottom: 56 },
  subtitle: { color: 'white' },
});

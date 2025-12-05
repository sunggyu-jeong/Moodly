import { MotiView } from 'moti';
import { DimensionValue, StyleSheet, View } from 'react-native';

import { gray } from '@/shared/styles/colors';

const SkeletonBox = ({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: any;
}) => {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.7 }}
      transition={{
        type: 'timing',
        duration: 800,
        loop: true,
      }}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: gray[300],
        },
        style,
      ]}
    />
  );
};

export const ReportLoadingSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SkeletonBox
          width={80}
          height={24}
          style={styles.title}
        />

        <View style={styles.card}>
          <View style={styles.emotionRow}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <View
                key={idx}
                style={styles.emotionItem}
              >
                <SkeletonBox
                  width={38}
                  height={38}
                  borderRadius={19}
                />
                <SkeletonBox
                  width={32}
                  height={18}
                  borderRadius={6}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <SkeletonBox
          width={120}
          height={24}
          style={styles.title}
        />

        <View style={styles.card}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <View
              key={idx}
              style={{ marginBottom: idx === 2 ? 0 : 24, gap: 8 }}
            >
              <SkeletonBox
                width={100}
                height={20}
                borderRadius={6}
              />

              <View style={{ gap: 6 }}>
                <SkeletonBox
                  width="100%"
                  height={18}
                  borderRadius={6}
                />
                <SkeletonBox
                  width="90%"
                  height={18}
                  borderRadius={6}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          {Array.from({ length: 3 }).map((_, idx) => (
            <View
              key={idx}
              style={{ marginBottom: idx === 2 ? 0 : 24, gap: 8 }}
            >
              <SkeletonBox
                width={100}
                height={20}
                borderRadius={6}
              />

              <View style={{ gap: 6 }}>
                <SkeletonBox
                  width="100%"
                  height={18}
                  borderRadius={6}
                />
                <SkeletonBox
                  width="90%"
                  height={18}
                  borderRadius={6}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // 전체 화면 여백
    gap: 32, // 섹션 간 간격
  },
  section: {
    width: '100%',
    gap: 12, // 타이틀과 카드 사이 간격
  },
  title: {
    marginLeft: 4,
  },
  card: {
    width: '100%',
    backgroundColor: gray[50],
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
  },
  emotionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emotionItem: {
    gap: 8,
    alignItems: 'center',
  },
});

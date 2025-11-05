import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DiarySkeleton = () => {
  const mode = 'light';
  return (
    <SafeAreaView style={styles.StyledContainer}>
      <Skeleton.Group show={true}>
        <MotiView
          transition={{ type: 'timing' }}
          animate={{ backgroundColor: '#ffffff' }}
          style={styles.StyledCard}
        >
          <View style={styles.StyledAvatarWrapper}>
            <Skeleton
              width={40}
              height={40}
              radius="round"
              colorMode={mode}
            />
          </View>

          <View style={styles.StyledLineShort}>
            <Skeleton
              width="50%"
              height={16}
              radius={4}
              colorMode={mode}
            />
          </View>

          <View style={styles.StyledLineMedium}>
            <Skeleton
              width="33%"
              height={16}
              radius={4}
              colorMode={mode}
            />
          </View>

          <View style={styles.StyledLineFull}>
            <Skeleton
              width="100%"
              height={12}
              radius={4}
              colorMode={mode}
            />
          </View>

          <Skeleton
            width="80%"
            height={12}
            radius={4}
            colorMode={mode}
          />
        </MotiView>
      </Skeleton.Group>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  StyledContainer: {
    flex: 1,
  },
  StyledCard: {
    backgroundColor: '#9CA3AF',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderRadius: 15,
    width: '100%',
  },
  StyledAvatarWrapper: {
    marginBottom: 12,
  },
  StyledLineShort: {
    marginBottom: 8,
  },
  StyledLineMedium: {
    marginBottom: 16,
  },
  StyledLineFull: {
    marginBottom: 8,
  },
});

export default DiarySkeleton;

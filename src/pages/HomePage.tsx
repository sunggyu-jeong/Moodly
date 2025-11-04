import { gray } from '@/shared/styles/colors';
import { HomeWidget } from '@/widgets/home';
import { View, StatusBar, StyleSheet } from 'react-native';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
      <HomeWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[100],
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomePage;

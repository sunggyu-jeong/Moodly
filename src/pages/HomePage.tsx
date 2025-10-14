import { HomeWidget } from '@/widgets/home';
import { StatusBar, View } from 'react-native';

const HomePage = () => {
  return (
    <View className="bg-gray-100 flex-1 px-5 justify-center items-center">
      <StatusBar
        translucent
        backgroundColor="transparent" 
      />
      <HomeWidget />
    </View>
  );
};

export default HomePage;

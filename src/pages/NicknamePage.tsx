import { SetNicknameForm } from '@features/set-nickname/ui/SetNicknameForm';
import { H2, resetTo } from '@shared';
import { NavigationBar } from '@widgets/navigation-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const NicknamePage = () => {
  const handleSuccess = () => {
    resetTo('Main');
  };

  return (
    <>
      <NavigationBar />
      <SafeAreaView className="flex-1 h-full bg-common-white">
        <View className="h-full px-5 mt-[7px]">
          <H2
            weight="semibold"
            style={Styles.titleStyle}
          >
            사용하실 닉네임을 알려주세요.
          </H2>
          <SetNicknameForm onSuccess={handleSuccess} />
        </View>
      </SafeAreaView>
    </>
  );
};

const Styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'left',
    marginBottom: 40,
  },
});

export default NicknamePage;

import { Image, TouchableOpacity, View } from 'react-native';
import { IMAGES } from '../../assets/images';
import TypographyAtom from '../atoms/Typography.atom';

export interface SettingItemProps {
  title: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
}

const SettingItem = ({...props}: SettingItemProps) => {
  const Container = props.onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={props.onPress}
      className="flex-row items-center justify-between p-4"
    >
      <View className="flex-row items-center">
        {props.rightComponent && <View className="mr-4">{props.rightComponent}</View>}
        <TypographyAtom variant="body">{props.title}</TypographyAtom>
      </View>
      <Image source={IMAGES.right} />
    </Container>
  );
};

export default SettingItem;
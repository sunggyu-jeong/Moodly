import { Text, View, ViewProps } from 'react-native';
import { getScaleSize } from '../../hooks';

interface ToolTipViewProps extends ViewProps {
  text: string;
}

const ToolTipView = ({ ...props }: ToolTipViewProps) => {
  return (
    <View
      className="w-full h-[54px]"
      style={props.style}
    >
      <View className="mx-6 h-full bg-[#FAFAFA] rounded-[29px] justify-center items-center">
        <Text
          className="text-pretendard font-semibold tracking-[-0.5px] text-center"
          style={{ fontSize: getScaleSize(19) }}
        >
          {props.text}
        </Text>
      </View>
    </View>
  );
};

export default ToolTipView;

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isNotEmpty } from '@shared/lib';
import NaviBackButton from '@shared/ui/elements/NaviBackButton';

import NaviActionButton, {
  NaviActionButtonProps,
} from '@/shared/ui/elements/NaviActionButton';

export interface NavigationBarConfig {
  showBackButton?: boolean;
  leftComponents?: NaviActionButtonProps[] | null;
  centerComponent?: React.ReactNode;
  actionButtons?: NaviActionButtonProps[];
}

const NavigationBar = ({
  showBackButton = true,
  centerComponent,
  actionButtons,
  leftComponents,
}: NavigationBarConfig) => {
  const hasLeftCenter = showBackButton || isNotEmpty(centerComponent);
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white"
      style={{ paddingTop: insets.top }}
    >
      <View
        className={`flex-row items-center h-[40px] px-[10px] bg-white ${
          hasLeftCenter ? 'justify-between' : 'justify-end'
        }`}
      >
        {showBackButton && (
          <View className="ml-3">
            <NaviBackButton />
          </View>
        )}

        {isNotEmpty(leftComponents) && (
          <View className="ml-3">
            {leftComponents.map((el, index) => (
              <NaviActionButton
                key={index}
                {...el}
              />
            ))}
          </View>
        )}
        <View className="flex-1" />

        {centerComponent && (
          <View className="items-center flex-1">{centerComponent}</View>
        )}

        <View className="flex-1" />

        {isNotEmpty(actionButtons) && (
          <View className="mr-[10px]">
            {actionButtons.map((el, index) => (
              <NaviActionButton
                key={index}
                {...el}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default NavigationBar;

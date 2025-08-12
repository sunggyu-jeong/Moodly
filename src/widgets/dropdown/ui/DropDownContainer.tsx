import { useAppSelector } from '@shared/hooks';
import { isNotEmpty } from '@shared/lib';
import { common } from '@shared/styles/colors';
import DropDownItem, { DropDownItemProps } from '@widgets/dropdown/ui/DropDownItem';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const DropDownContainer = () => {
  const showDropDownView = useAppSelector(state => state.overlaySlice.showDropDownView);

  return (
    <View
      className="justify-center w-[148px] rounded-xl bg-common-white z-[999]"
      style={styles.boxStyle}
    >
      {isNotEmpty(showDropDownView?.dropdownList) &&
        showDropDownView.dropdownList.map((item: DropDownItemProps, idx: number) => (
          <React.Fragment key={idx}>
            <DropDownItem {...item} />
            {idx < (showDropDownView?.dropdownList?.length ?? 1) - 1 && (
              <View className="h-[1px] bg-gray-200" />
            )}
          </React.Fragment>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boxStyle: {
    elevation: 5,
    shadowColor: common.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
  },
});

export default DropDownContainer;

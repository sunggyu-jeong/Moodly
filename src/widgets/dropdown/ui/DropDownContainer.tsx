import { useAppSelector } from '@/shared/hooks/useHooks';
import { isNotEmpty } from '@/shared/lib/value.util';
import { common } from '@/shared/styles/colors';
import DropDownItem, { DropDownItemProps } from '@/widgets/dropdown/ui/DropDownItem';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const DropDownContainer = () => {
  const showDropDownView = useAppSelector(state => state.overlaySlice.showDropDownView);

  return (
    <View style={[styles.container, styles.boxStyle]}>
      {isNotEmpty(showDropDownView?.dropdownList) &&
        showDropDownView.dropdownList.map((item: DropDownItemProps, idx: number) => (
          <React.Fragment key={idx}>
            <DropDownItem {...item} />
            {idx < (showDropDownView?.dropdownList?.length ?? 1) - 1 && (
              <View style={styles.divider} />
            )}
          </React.Fragment>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: 148,
    borderRadius: 12,
    backgroundColor: common.white,
    zIndex: 999,
  },
  boxStyle: {
    elevation: 5,
    shadowColor: common.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});

export default DropDownContainer;

import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from '../../hooks';
import { isNotEmpty } from '../../utils';
import DropDownItem from '../molecules/DropDownItem.mol';

const DropDownContainer = () => {
  const showDropDownView = useAppSelector((state) => state.commonSlice.showDropDownView);

  return (
    <View className="justify-center w-[148px] rounded-xl bg-white shadow-[0px_10px_40px_0px_rgba(0,0,0,0.12)] z-[999]">
      {isNotEmpty(showDropDownView?.dropdownList) &&
        showDropDownView.dropdownList.map((item, idx) => (
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

export default DropDownContainer;

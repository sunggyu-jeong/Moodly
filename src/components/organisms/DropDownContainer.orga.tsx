import React from "react";
import { View } from "react-native";
import DropDownItemAtom from "../atoms/DropdownItem.atom";
import { useAppSelector } from "../../hooks";
import { isEmpty } from "../../utils";


const DropDownOrga = () => {
  const { visibility, dropdownList } = useAppSelector(
    (state) => state.commonSlice.showDropDownView
  );

  if (!visibility || isEmpty(dropdownList)) {
    return null;
  }

  return (
    <View
      className="justify-center w-[148px] rounded-xl bg-white shadow-sm z-[999]"
    >
      {dropdownList.map((item, idx) => (
        <React.Fragment key={idx}>
          <DropDownItemAtom {...item} />
          {idx < dropdownList.length - 1 && (
            <View className="h-[1px] bg-gray-200" />
          )}
        </React.Fragment>
      ))}
    </View>
  )
}

export default DropDownOrga;
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useAppDispatch } from "../../hooks";
import { setShowDropdownView, setShowModalPopup } from "../../redux/slice/commonSlice";
import { navigate } from "../../utils";

export const DropDownEventIdentifier = {
  MODIFY_DIARY: "MODIFY_DIARY",
  DELETE_DIARY: "DELETE_DIARY"
} as const;

export interface DropDownItemAtomProps {
  text: string;
  source: any;
  eventIdentifier: keyof typeof DropDownEventIdentifier;
}

const DropDownItemAtom = ({ ...props }: DropDownItemAtomProps) => {
  const dispatch = useAppDispatch();
  const handleDropdownEvents = (eventIdentifier: keyof typeof DropDownEventIdentifier) => {
    dispatch(setShowDropdownView({visibility: false, dropdownList: null, pos: {x: null, y: null}}))
    switch (eventIdentifier)  {
      case DropDownEventIdentifier.MODIFY_DIARY:
        // navigate("WriteDiary", { origin: "RootStack" });
      case DropDownEventIdentifier.DELETE_DIARY:
        dispatch(setShowModalPopup(true));
        break;
    }
  }

  return (
    <TouchableOpacity onPress={() => {handleDropdownEvents(props.eventIdentifier)}}>
      <View className="h-[48px] justify-between flex-row items-center">
        <Text 
          className="ml-[14px] font-pretendard text-sm tracking-[-0.5px]"
          style={{ color: props.eventIdentifier === DropDownEventIdentifier.DELETE_DIARY ? '#FF0000' : '#212123' }}
        >
          {props.text}
        </Text>
        <Image className="mr-3 w-6 h-6" source={props.source} />
      </View>
    </TouchableOpacity>
  );
};

export default DropDownItemAtom;
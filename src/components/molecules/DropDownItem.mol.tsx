import { ImageSourcePropType } from "react-native";
import { useAppDispatch } from "../../hooks";
import { setShowDropdownView, setShowModalPopup } from "../../redux/slice/commonSlice";
import { navigate } from "../../utils";
import DropDownItemAtom from "../atoms/DropdownItem.atom";

export const DropDownEventIdentifier = {
  MODIFY_DIARY: "MODIFY_DIARY",
  DELETE_DIARY: "DELETE_DIARY"
} as const;

export interface DropDownItemProps {
  text: string;
  source: ImageSourcePropType;
  eventIdentifier: keyof typeof DropDownEventIdentifier;
}

const DropDownItem = ({ ...props }: DropDownItemProps) => {
  const dispatch = useAppDispatch();
  const handle = () => {
    dispatch(setShowDropdownView({ visibility: false, dropdownList: null, pos: {x: null, y: null} }));
    if (props.eventIdentifier === DropDownEventIdentifier.MODIFY_DIARY) {
      navigate("WriteDiary", { origin: "RootStack"});
    } else {
      dispatch(setShowModalPopup(true));
    }
  };

  return (
    <DropDownItemAtom
      text={props.text}
      source={props.source}
      textColor={
        props.eventIdentifier === 'DELETE_DIARY' ? '#FF0000' : '#212123'
      }
      onPress={handle}
    />
  );
};

export default DropDownItem;
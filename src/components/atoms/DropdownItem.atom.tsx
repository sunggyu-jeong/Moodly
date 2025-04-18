import { Image, Text, TouchableOpacity, View } from "react-native";

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
  const handleDropdownEvents = (eventIdentifier: keyof typeof DropDownEventIdentifier) => {
    switch (eventIdentifier)  {
      case DropDownEventIdentifier.MODIFY_DIARY:
      case DropDownEventIdentifier.DELETE_DIARY:
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
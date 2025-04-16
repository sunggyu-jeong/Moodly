import { View } from "react-native";
import PopupHeader from "../molecules/PopupHeader.mol";
import PopupFooter from "../molecules/PopupFooter.mol";
import DimmedViewAtom from "../atoms/DimmedView.atom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setShowModalPopup } from "@/redux/slice/commonSlice";

interface PopupContainerProps {
  title: string;
  message: string;
  visible: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
}

const PopupContainer = ({ ...props }: PopupContainerProps) => {
  const showModalPopup = useAppSelector((state) => state.commonSlice.showModalPopup);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(setShowModalPopup(false));
  }

  return (
    <>
      {
        showModalPopup &&
        <DimmedViewAtom onPress={handleCloseModal}>
          <View className="flex-1 justify-center p-10">
            <View className="w-full h-[177px] bg-white rounded-xl items-center">
              <PopupHeader title={props.title} message={props.message} />
              <PopupFooter 
                onCancel={handleCloseModal} 
                onConfirm={props.onConfirm} 
                cancelText={props.cancelText}
                confirmText={props.confirmText}
              />
            </View>
          </View>
        </DimmedViewAtom>
        
      }
    </>
  )
}

export default PopupContainer;
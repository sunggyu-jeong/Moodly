import { Animated, View, Modal } from "react-native";
import React, { useEffect, useRef } from "react";
import PopupHeader from "../molecules/PopupHeader.mol";
import PopupFooter from "../molecules/PopupFooter.mol";
import DimmedViewAtom from "../atoms/DimmedView.atom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setShowModalPopup } from "../../redux/slice/commonSlice";

interface PopupContainerProps {
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: () => void;
}

const PopupContainer = ({ ...props }: PopupContainerProps) => {
  const showModalPopup = useAppSelector((state) => state.commonSlice.showModalPopup);
  const dispatch = useAppDispatch();

  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleCloseModal = () => {
    dispatch(setShowModalPopup(false));
  }

  if (!showModalPopup) return null;
  return (
    <Modal transparent visible onRequestClose={handleCloseModal} animationType="fade">
      <DimmedViewAtom onPress={handleCloseModal}>
        <Animated.View style={{ transform: [{ translateY }] }} className="flex-1 justify-center p-10">
          <View className="w-full h-[177px] bg-white rounded-xl items-center">
            <PopupHeader title={props.title} message={props.message} />
            <PopupFooter 
              onCancel={handleCloseModal} 
              onConfirm={props.onConfirm} 
              cancelText={props.cancelText}
              confirmText={props.confirmText}
            />
          </View>
        </Animated.View>
      </DimmedViewAtom>
    </Modal>
  );
}

export default React.memo(PopupContainer);
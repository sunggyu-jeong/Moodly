import DimmedView from '@/components/atoms/DimmedView';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setShowModalPopup } from '@/processes/overlay/model/overlaySlice';
import React, { useEffect, useRef } from 'react';
import { Animated, Modal, View } from 'react-native';
import PopupFooter from './PopupFooter';
import PopupHeader from './PopupHeader';

interface PopupContainerProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
}

const PopupContainer = ({ ...props }: PopupContainerProps) => {
  const showModalPopup = useAppSelector((state) => state.overlaySlice.showModalPopup);
  const dispatch = useAppDispatch();

  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showModalPopup?.visibility) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 30,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) {
          dispatch(
            setShowModalPopup({
              visibility: null,
              title: '',
              message: '',
              confirmActionKey: '',
            })
          );
        }
      });
    }
  }, [showModalPopup]);

  const handleCloseModal = () => {
    dispatch(
      setShowModalPopup({
        visibility: false,
        title: showModalPopup?.title ?? '',
        message: showModalPopup?.message ?? '',
        confirmText: showModalPopup?.confirmText,
        cancelText: showModalPopup?.cancelText,
        confirmActionKey: showModalPopup?.confirmActionKey ?? '',
      })
    );
  };

  return (
    <Modal
      transparent
      visible
      onRequestClose={handleCloseModal}
      animationType="fade"
    >
      <DimmedView onPress={handleCloseModal}>
        <Animated.View
          style={{ transform: [{ translateY }], opacity: opacity }}
          className="flex-1 justify-center p-10"
        >
          <View className="w-full h-[177px] bg-white rounded-xl items-center">
            <PopupHeader
              title={props.title}
              message={props.message}
            />
            <PopupFooter
              onCancel={handleCloseModal}
              onConfirm={props.onConfirm}
              cancelText={props.cancelText}
              confirmText={props.confirmText}
            />
          </View>
        </Animated.View>
      </DimmedView>
    </Modal>
  );
};

export default React.memo(PopupContainer);

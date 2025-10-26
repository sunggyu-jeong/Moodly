import { setShowModalPopup } from '@/processes/overlay/model/overlaySlice';
import { common, DimmedView, useAppDispatch, useAppSelector } from '@/shared';
import { memo, useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';
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
  const showModalPopup = useAppSelector(state => state.overlaySlice.showModalPopup);
  const dispatch = useAppDispatch();

  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const isVisible = Boolean(showModalPopup?.visibility);
    const toValueY = isVisible ? 0 : 30;
    const toValueOpacity = isVisible ? 1 : 0;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: toValueY,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: toValueOpacity,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished && !isVisible) {
        dispatch(
          setShowModalPopup({
            visibility: null,
            title: '',
            message: '',
            confirmActionKey: '',
          }),
        );
      }
    });
  }, [showModalPopup?.visibility, dispatch, opacity, translateY]);

  const handleCloseModal = () => {
    dispatch(
      setShowModalPopup({
        visibility: false,
        title: showModalPopup?.title ?? '',
        message: showModalPopup?.message ?? '',
        confirmText: showModalPopup?.confirmText,
        cancelText: showModalPopup?.cancelText,
        confirmActionKey: showModalPopup?.confirmActionKey ?? '',
      }),
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
          style={[styles.animatedContainer, { transform: [{ translateY }], opacity: opacity }]}
        >
          <View style={styles.popupBox}>
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

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  popupBox: {
    width: '100%',
    backgroundColor: common.white,
    borderRadius: 12,
    alignItems: 'center',
  },
});

export default memo(PopupContainer);

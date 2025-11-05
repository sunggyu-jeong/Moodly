import { memo, useEffect, useRef } from 'react';
import { Animated, Modal, StyleSheet, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { setShowModalPopup } from '@/shared/model/overlaySlice';
import { common } from '@/shared/styles/colors';
import DimmedView from '@/shared/ui/elements/DimmedView';
import PopupFooter from '@/shared/ui/elements/popup/PopupFooter';
import PopupHeader from '@/shared/ui/elements/popup/PopupHeader';

interface PopupContainerProps {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel?: () => void;
  disableBackdropClose?: boolean;
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
    if (props.onCancel) {
      props.onCancel();
    }
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
      <DimmedView onPress={props.disableBackdropClose ? undefined : handleCloseModal}>
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

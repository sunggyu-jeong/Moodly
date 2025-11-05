import { memo, useCallback, useEffect, useMemo } from 'react';
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
  const showModalPopup = useAppSelector(s => s.overlaySlice.showModalPopup);
  const dispatch = useAppDispatch();

  const translateY = useMemo(() => new Animated.Value(30), []);
  const opacity = useMemo(() => new Animated.Value(0), []);

  const isVisible = Boolean(showModalPopup?.visibility);

  const handleCloseModal = useCallback(() => {
    props.onCancel?.();
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
  }, [
    dispatch,
    props,
    showModalPopup?.title,
    showModalPopup?.message,
    showModalPopup?.confirmText,
    showModalPopup?.cancelText,
    showModalPopup?.confirmActionKey,
  ]);

  useEffect(() => {
    const toValueY = isVisible ? 0 : 30;
    const toValueO = isVisible ? 1 : 0;

    const anim = Animated.parallel([
      Animated.timing(translateY, { toValue: toValueY, duration: 150, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: toValueO, duration: 150, useNativeDriver: true }),
    ]);

    anim.start(({ finished }) => {
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

    return () => {
      translateY.stopAnimation();
      opacity.stopAnimation();
    };
  }, [isVisible, dispatch, translateY, opacity]);

  return (
    <Modal
      transparent
      visible={isVisible}
      onRequestClose={handleCloseModal}
      animationType="fade"
    >
      <DimmedView onPress={props.disableBackdropClose ? undefined : handleCloseModal}>
        <Animated.View style={[styles.animatedContainer, { transform: [{ translateY }], opacity }]}>
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

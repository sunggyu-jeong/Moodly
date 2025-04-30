import React, { useCallback } from 'react';
import { ImageSourcePropType } from 'react-native';

import {
  setShowDropdownView,
  setShowModalPopup,
} from '@/processes/overlay/model/overlaySlice';
import { MODAL_CONFIRM_ACTION_KEY } from '@/processes/overlay/ui/OverlayManager';
import { useAppDispatch } from '@/shared/hooks';
import { navigateFlow, NavigationFlow } from '@/shared/lib';
import SelectableItem from '@/shared/ui/elements/SelectableItem';

export const DropDownEventIdentifier = {
  MODIFY_DIARY: 'MODIFY_DIARY',
  DELETE_DIARY: 'DELETE_DIARY',
} as const;

export interface DropDownItemProps {
  text: string;
  source: ImageSourcePropType;
  eventIdentifier: keyof typeof DropDownEventIdentifier;
}

const DropDownItem: React.FC<DropDownItemProps> = ({ text, source, eventIdentifier }) => {
  const textColor =
    eventIdentifier === DropDownEventIdentifier.DELETE_DIARY ? '#FF0000' : '#212123';

  const dispatch = useAppDispatch();

  const handlers = React.useMemo(
    () =>
      ({
        [DropDownEventIdentifier.MODIFY_DIARY]: () => {
          navigateFlow(NavigationFlow.DiaryDetailToEmotionWriteWithReturn);
        },
        [DropDownEventIdentifier.DELETE_DIARY]: () => {
          dispatch(
            setShowModalPopup({
              visibility: true,
              title: '일기를 삭제할까요?',
              message: '삭제한 일기는 복구가 어려워요.',
              cancelText: '취소',
              confirmText: '확인',
              confirmActionKey: MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY,
            })
          );
        },
      }) as Record<keyof typeof DropDownEventIdentifier, () => void>,
    [dispatch]
  );

  const handlePress = useCallback(() => {
    dispatch(
      setShowDropdownView({
        visibility: null,
        dropdownList: null,
        pos: { x: null, y: null },
      })
    );
    handlers[eventIdentifier]();
  }, [dispatch, eventIdentifier, handlers]);

  return (
    <SelectableItem
      text={text}
      source={source}
      textColor={textColor}
      onPress={handlePress}
    />
  );
};

export default DropDownItem;

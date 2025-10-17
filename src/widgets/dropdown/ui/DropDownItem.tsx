import { setModifyMode } from '@/features/diary/model/diarySlice';
import { MODAL_CONFIRM_ACTION_KEY } from '@/processes/key';
import { setShowDropdownView, setShowModalPopup } from '@/processes/overlay/model/overlaySlice';
import { navigateFlow, NavigationFlow, SelectableItem, useAppDispatch } from '@/shared';
import React, { useCallback } from 'react';
import type { ImageSourcePropType } from 'react-native';

export const DropDownEventIdentifier = {
  MODIFY_DIARY: 'MODIFY_DIARY',
  DELETE_DIARY: 'DELETE_DIARY',
} as const;

export interface DropDownItemProps {
  text: string;
  source: ImageSourcePropType;
  eventIdentifier: keyof typeof DropDownEventIdentifier;
}

const DropDownItem = ({ text, source, eventIdentifier }: DropDownItemProps) => {
  const textColor =
    eventIdentifier === DropDownEventIdentifier.DELETE_DIARY ? '#FF0000' : '#212123';

  const dispatch = useAppDispatch();

  const handlers = React.useMemo(
    () =>
      ({
        [DropDownEventIdentifier.MODIFY_DIARY]: () => {
          dispatch(setModifyMode(true));
          navigateFlow(NavigationFlow.DiaryDetailToEmotionWriteWithReturn);
        },
        [DropDownEventIdentifier.DELETE_DIARY]: () => {
          dispatch(
            setShowModalPopup({
              visibility: true,
              title: '일기를 삭제할까요?',
              message: '삭제된 일기는 복구가 어려워요',
              cancelText: '취소',
              confirmText: '삭제',
              confirmActionKey: MODAL_CONFIRM_ACTION_KEY.DELETE_DIARY,
            }),
          );
        },
      }) as Record<keyof typeof DropDownEventIdentifier, () => void>,
    [dispatch],
  );

  const handlePress = useCallback(() => {
    dispatch(
      setShowDropdownView({
        visibility: null,
        dropdownList: null,
        pos: { x: null, y: null },
      }),
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

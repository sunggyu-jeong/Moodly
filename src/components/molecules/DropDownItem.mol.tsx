import { ImageSourcePropType } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MODAL_CONFIRM_ACTION_KEY } from '../../manager/OverlayManager';
import { setShowDropdownView, setShowModalPopup } from '../../redux/slice/commonSlice';
import { navigateFlow, NavigationFlow } from '../../utils';
import DropDownItemAtom from '../atoms/DropdownItem.atom';

export const DropDownEventIdentifier = {
  MODIFY_DIARY: 'MODIFY_DIARY',
  DELETE_DIARY: 'DELETE_DIARY',
} as const;

export interface DropDownItemProps {
  text: string;
  source: ImageSourcePropType;
  eventIdentifier: keyof typeof DropDownEventIdentifier;
}

const DropDownItem = ({ ...props }: DropDownItemProps) => {
  const dispatch = useAppDispatch();
  const showDropDownView = useAppSelector((state) => state.commonSlice.showDropDownView);
  const handle = () => {
    dispatch(
      setShowDropdownView({
        visibility: null,
        dropdownList: null,
        pos: { x: null, y: null },
      })
    );

    if (props.eventIdentifier === DropDownEventIdentifier.MODIFY_DIARY) {
      navigateFlow(NavigationFlow.DiaryDetailToEmotionWriteWithReturn);
    } else {
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
    }
  };

  return (
    <DropDownItemAtom
      text={props.text}
      source={props.source}
      textColor={props.eventIdentifier === 'DELETE_DIARY' ? '#FF0000' : '#212123'}
      onPress={handle}
    />
  );
};

export default DropDownItem;

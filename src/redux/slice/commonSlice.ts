import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DropDownItemProps } from '../../components/molecules/DropDownItem.mol';

interface DropdownViewPayload {
  visibility?: boolean | null;
  dropdownList: DropDownItemProps[] | null;
  pos: { x: number | null; y: number | null };
}

interface ToastViewPayload {
  visibility?: boolean | null;
  message: string;
}

interface ModalViewPayload {
  visibility?: boolean | null;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  confirmActionKey: string;
}

interface CommonState {
  showModalPopup?: ModalViewPayload;
  showDropDownView?: DropdownViewPayload;
  showToastView?: ToastViewPayload;
}

const initialState: CommonState = {
  showModalPopup: { visibility: null, title: '', message: '', confirmActionKey: '' },
  showDropDownView: { visibility: false, dropdownList: null, pos: { x: null, y: null } },
  showToastView: { visibility: null, message: '' },
};

const commonSlice = createSlice({
  name: 'common',
  initialState: initialState,
  reducers: {
    setShowModalPopup: (state, action: PayloadAction<ModalViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>1', action);
      state.showModalPopup = action.payload;
    },
    setShowDropdownView: (state, action: PayloadAction<DropdownViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>2', action);
      state.showDropDownView = action.payload;
    },
    setShowToastView: (state, action: PayloadAction<ToastViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>3', action);
      state.showToastView = action.payload;
    },
  },
});

export const { setShowModalPopup, setShowDropdownView, setShowToastView } = commonSlice.actions;

export default commonSlice.reducer;

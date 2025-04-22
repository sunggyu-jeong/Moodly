import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DropDownItemProps } from "../../components/molecules/DropDownItem.mol";

interface DropdownViewPayload {
  visibility?: boolean | null;
  dropdownList: DropDownItemProps[] | null;
  pos: { x: number | null, y: number | null }
}

interface ToastViewPayload {
  visibility?: boolean | null
  message: string
}

interface CommonState {
  showModalPopup?: boolean | null;
  showDropDownView?: DropdownViewPayload;
  showToastView?: ToastViewPayload;
}

const initialState: CommonState = {
  showModalPopup: false,
  showDropDownView: { visibility: false, dropdownList: null, pos: { x: null, y: null } },
  showToastView: { visibility: null, message: '' },
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setShowModalPopup: (state, action: PayloadAction<boolean | null>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>1', action)
      state.showModalPopup = action.payload;
    },
    setShowDropdownView: (state, action: PayloadAction<DropdownViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>2', action)
      state.showDropDownView = action.payload;
    },
    setShowToastView: (state, action: PayloadAction<ToastViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>3', action)
      state.showToastView = action.payload
    }
  },
});

export const { setShowModalPopup, setShowDropdownView, setShowToastView } = commonSlice.actions;

export default commonSlice.reducer;
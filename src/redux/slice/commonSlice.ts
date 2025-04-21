import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DropDownItemProps } from "../../components/molecules/DropDownItem.mol";

interface ShowDropdownViewPayload {
  visibility: boolean;
  dropdownList: DropDownItemProps[] | null;
  pos: { x: number | null, y: number | null }
}

interface CommonState {
  showModalPopup: boolean;
  showDropDownView: ShowDropdownViewPayload;
  showToastView: boolean;
}

const initialState: CommonState = {
  showModalPopup: false,
  showDropDownView: { visibility: false, dropdownList: null, pos: { x: null, y: null } },
  showToastView: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setShowModalPopup: (state, action: PayloadAction<boolean>) => {
      state.showModalPopup = action.payload;
    },
    setShowDropdownView: (state, action: PayloadAction<ShowDropdownViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>', action)
      state.showDropDownView = action.payload;
    },
    setShowToastView: (state, action: PayloadAction<boolean>) => {
      state.showToastView = action.payload
    }
  },
});

export const { setShowModalPopup, setShowDropdownView, setShowToastView } = commonSlice.actions;

export default commonSlice.reducer;
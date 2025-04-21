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
}

const initialState: CommonState = {
  showModalPopup: false,
  showDropDownView: { visibility: false, dropdownList: null, pos: { x: null, y: null } }
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setShowModalPopup: (state, action) => {
      state.showModalPopup = action.payload;
    },
    setShowDropdownView: (state, action: PayloadAction<ShowDropdownViewPayload>) => {
      console.log('>>>>>>>>>>>>>>>>>>>>>>>>', action)
      state.showDropDownView = action.payload;
    }
  },
});

export const { setShowModalPopup, setShowDropdownView } = commonSlice.actions;

export default commonSlice.reducer;
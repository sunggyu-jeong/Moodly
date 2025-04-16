import { createSlice } from "@reduxjs/toolkit";

interface CommonState {
  showModalPopup: boolean;
}

const initialState: CommonState = {
  showModalPopup: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState: initialState,
  reducers: {
    setShowModalPopup: (state, action) => {
      state.showModalPopup = action.payload;
    }
  },
});

export const { setShowModalPopup } = commonSlice.actions;

export default commonSlice.reducer;
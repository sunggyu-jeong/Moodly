import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoginStatus = 'PENDING' | 'REQUEST' | 'FINISH';

interface SettingState {
  loginStatus: LoginStatus;
}

const initialState: SettingState = {
  loginStatus: 'PENDING',
};

const settingSlice = createSlice({
  name: 'setting',
  initialState: initialState,
  reducers: {
    setRequestLogin(state, action: PayloadAction<LoginStatus>) {
      state.loginStatus = action.payload;
    },
  },
});

export const { setRequestLogin } = settingSlice.actions;

export default settingSlice.reducer;

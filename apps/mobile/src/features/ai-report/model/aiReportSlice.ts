import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AIReportDomain } from '@/features/ai-report/model/domain';

interface AIReportState {
  reportDates: string[];
  selectedReport: AIReportDomain | null;
}

const initialState: AIReportState = {
  reportDates: [],
  selectedReport: null,
};

export const aiReportSlice = createSlice({
  name: 'aiReport',
  initialState,
  reducers: {
    setReportDates: (state, action: PayloadAction<string[]>) => {
      state.reportDates = action.payload;
    },
    setSelectedReport: (state, action: PayloadAction<AIReportDomain | null>) => {
      state.selectedReport = action.payload;
    },
  },
});

export const { setReportDates, setSelectedReport } = aiReportSlice.actions;
export default aiReportSlice.reducer;

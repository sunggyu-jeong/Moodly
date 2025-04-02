import { AsyncOperationState, initialAsyncState } from "../../constant/ApiStatus";
import { EmotionDiary, EmotionDiaryDTO } from "../../scheme";
import { 
  createDiary,
  deleteDiary, 
  selectDiaryById, 
  selectDiaryByMonth, 
  updateDiary } from "../../services";
import { addAsyncThunkCase } from "../..//utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Realm from 'realm';

const searchDiaryByIdThunk = createAsyncThunk<EmotionDiaryDTO | undefined, {realm: Realm, emotionId: string}, { rejectValue: string }>(
  'diary/searchDiaryById',
  async (payload, { rejectWithValue }) => {
    try {
      const result: EmotionDiary | null = selectDiaryById(payload.realm, payload.emotionId);
      return result?.toDTO();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

const searchDiaryByMonthThunk = createAsyncThunk<EmotionDiaryDTO[], {realm: Realm, recordDate: Date}, { rejectValue: string }>(
  'diary/searchDiaryByMonth',
  async (payload, { rejectWithValue }) => {
    try {
      const result: EmotionDiary[] = selectDiaryByMonth(payload.realm, payload.recordDate) || [];
      return result?.map((el) => el.toDTO());
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

const addDiaryThunk = createAsyncThunk<void, {realm: Realm, data: EmotionDiaryDTO}, { rejectValue: string }>(
  'diary/addDiary',
  async (payload, { rejectWithValue }) => {
    try {
      createDiary(payload.realm, payload.data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

const modifyDiaryThunk = createAsyncThunk<void, {realm: Realm, emotionId: string, data: EmotionDiaryDTO}, { rejectValue: string }>(
  'diary/modifyDiary',
  async (payload, { rejectWithValue }) => {
    try {
      updateDiary(payload.realm, payload.emotionId, payload.data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

const removeDiaryThunk = createAsyncThunk<void, {realm: Realm, emotionId: string}, { rejectValue: string }>(
  'diary/removeDiary',
  async (payload, { rejectWithValue }) => {
    try {
      deleteDiary(payload.realm, payload.emotionId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

interface DiaryState {
  emotionDiaryList: EmotionDiaryDTO[];
  selectedEmotionDiary: EmotionDiaryDTO | null;
  searchById: AsyncOperationState;
  searchByMonth: AsyncOperationState;
  addDiary: AsyncOperationState;
  modifyDiary: AsyncOperationState;
  removeDiary: AsyncOperationState;
}

const initialState: DiaryState = {
  emotionDiaryList: [],
  selectedEmotionDiary: null,
  searchById: { ...initialAsyncState },
  searchByMonth: { ...initialAsyncState },
  addDiary: { ...initialAsyncState },
  modifyDiary: { ...initialAsyncState },
  removeDiary: { ...initialAsyncState },
};

const diarySlice = createSlice({
  name: "diary",
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    addAsyncThunkCase<EmotionDiaryDTO | undefined, DiaryState>(
      builder,
      searchDiaryByIdThunk,
      'searchById',
      'searchById',
      (state, action) => {
        state.selectedEmotionDiary = action.payload || null;
      },
      '조회 요청이 실패했습니다.'
    );
    addAsyncThunkCase<EmotionDiaryDTO[] | undefined, DiaryState>(
      builder,
      searchDiaryByMonthThunk,
      'searchByMonth',
      'searchByMonth',
      (state, action) => {
        state.emotionDiaryList = action.payload || [];
      },
      '조회 요청이 실패했습니다.'
    );
    addAsyncThunkCase<void, DiaryState>(
      builder,
      addDiaryThunk,
      'addDiary',
      'addDiary',
      undefined,
      '등록 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
    addAsyncThunkCase<void, DiaryState>(
      builder,
      modifyDiaryThunk,
      'modifyDiary',
      'modifyDiary',
      undefined,
      '수정 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
    addAsyncThunkCase<void, DiaryState>(
      builder,
      removeDiaryThunk,
      'removeDiary',
      'removeDiary',
      undefined,
      '삭제 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
  }
})

export {
  searchDiaryByIdThunk,
  searchDiaryByMonthThunk,
  addDiaryThunk,
  modifyDiaryThunk,
  removeDiaryThunk,
}

export default diarySlice.reducer;
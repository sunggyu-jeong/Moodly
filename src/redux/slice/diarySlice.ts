import { AsyncOperationState, createInitialAsyncState } from "../../constant/ApiStatus";
import { EmotionDiary, EmotionDiaryDTO } from "../../scheme";
import { 
  createDiary,
  deleteDiary, 
  selectDiaryById, 
  selectDiaryByMonth, 
  selectDiaryCount, 
  updateDiary } from "../../services";
import { addAsyncThunkCase } from "../..//utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Realm from 'realm';
import { Emotions } from "../../components/atoms/EmotionIcon.atom";
import dayjs from "dayjs";

const searchDiaryCountThunk = createAsyncThunk<number | undefined, {realm: Realm}, { rejectValue: string }>(
  'diary/searchDiaryCount',
  async (payload, { rejectWithValue }) => {
    try {
      const result: number = selectDiaryCount(payload.realm);
      return result;
    } catch(error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const searchDiaryByIdThunk = createAsyncThunk<EmotionDiaryDTO | undefined, {realm: Realm, emotionId: number}, { rejectValue: string }>(
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

const modifyDiaryThunk = createAsyncThunk<void, {realm: Realm, emotionId: number, data: EmotionDiaryDTO}, { rejectValue: string }>(
  'diary/modifyDiary',
  async (payload, { rejectWithValue }) => {
    try {
      updateDiary(payload.realm, payload.emotionId, payload.data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)

const removeDiaryThunk = createAsyncThunk<void, {realm: Realm, emotionId: number}, { rejectValue: string }>(
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
  diaryCount: AsyncOperationState<number>;
  emotionDiaryList: AsyncOperationState<EmotionDiaryDTO[]>;
  searchById: AsyncOperationState<void>;
  searchByMonth: AsyncOperationState<EmotionDiaryDTO[]>;
  addDiary: AsyncOperationState<void>;
  modifyDiary: AsyncOperationState<void>;
  removeDiary: AsyncOperationState<void>;
  selectedDiary: EmotionDiaryDTO;
  selectedEmotion: Emotions | null;
  todayDiary: EmotionDiaryDTO;
  selectedMonth: string;
}

const initialState: DiaryState = {
  diaryCount: createInitialAsyncState<number>(),
  emotionDiaryList: createInitialAsyncState<EmotionDiaryDTO[]>(),
  searchById: createInitialAsyncState<void>(),
  searchByMonth: createInitialAsyncState<EmotionDiaryDTO[]>(),
  addDiary: createInitialAsyncState<void>(),
  modifyDiary: createInitialAsyncState<void>(),
  removeDiary: createInitialAsyncState<void>(),
  selectedDiary: {},
  selectedEmotion: null,
  todayDiary: {
    emotionId: undefined,
    iconId: undefined,
    recordDate: undefined,
    description: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  },
  selectedMonth: dayjs().toISOString(),
};

const diarySlice = createSlice({
  name: "diary",
  initialState: initialState,
  reducers: {
    setSelectedEmotion: (state, action) => {
      state.selectedEmotion = action.payload;
    },
    setTodayDiary: (state, action) => {
      state.todayDiary = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setSelectedDiary: (state, action) => {
      state.selectedDiary = action.payload;
    }
  },
  extraReducers: (builder) => {
    addAsyncThunkCase<number | undefined, DiaryState>(
      builder,
      searchDiaryCountThunk,
      "diaryCount",
      "diaryCount",
      "검색어 갯수 조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요"
    ),
    addAsyncThunkCase<EmotionDiaryDTO | undefined, DiaryState>(
      builder,
      searchDiaryByIdThunk,
      'searchById',
      'searchById',
      '조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요'
    );
    addAsyncThunkCase<EmotionDiaryDTO[], DiaryState>(
      builder,
      searchDiaryByMonthThunk,
      'searchByMonth',
      'searchByMonth',
      '조회 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
    addAsyncThunkCase<void, DiaryState>(
      builder,
      addDiaryThunk,
      'addDiary',
      'addDiary',
      '등록 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
    addAsyncThunkCase<void, DiaryState>(
      builder,
      modifyDiaryThunk,
      'modifyDiary',
      'modifyDiary',
      '수정 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
    addAsyncThunkCase<void, DiaryState>(
      builder,
      removeDiaryThunk,
      'removeDiary',
      'removeDiary',
      '삭제 요청이 실패했습니다. 잠시 후 다시 시도해주세요.'
    );
  }
})

export {
  searchDiaryCountThunk,
  searchDiaryByIdThunk,
  searchDiaryByMonthThunk,
  addDiaryThunk,
  modifyDiaryThunk,
  removeDiaryThunk
}

export const { 
  setSelectedEmotion, 
  setTodayDiary, 
  setSelectedMonth,
  setSelectedDiary
} = diarySlice.actions;

export default diarySlice.reducer;
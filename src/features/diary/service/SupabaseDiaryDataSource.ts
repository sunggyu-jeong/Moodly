import { DiaryDataSource } from './DiaryDataSource';
import {
  countSupabase,
  createSupabase,
  deleteSupabase,
  hasDiaryForDaySupabase,
  selectByIdSupabase,
  selectByMonthSupabase,
  updateSupabase,
} from './EmotionDiarySupabaseService';

export const supabaseDiaryDataSource: DiaryDataSource = {
  searchCount: async () => {
    return countSupabase();
  },
  searchById: async (_, emotionId) => {
    return selectByIdSupabase(emotionId);
  },
  searchByMonth: async (_, recordDate) => {
    return selectByMonthSupabase(recordDate);
  },
  add: async (_, data) => {
    return createSupabase(data);
  },
  modify: async (_, emotionId, data) => {
    return updateSupabase(emotionId, data);
  },
  remove: async (_, emotionId) => {
    return deleteSupabase(emotionId);
  },
  isExist: async (_, recordDate) => {
    return hasDiaryForDaySupabase(recordDate);
  },
};

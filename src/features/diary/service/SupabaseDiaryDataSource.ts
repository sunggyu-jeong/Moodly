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
  searchById: async emotionId => {
    return selectByIdSupabase(emotionId);
  },
  searchByMonth: async recordDate => {
    return selectByMonthSupabase(recordDate);
  },
  add: async data => {
    return createSupabase(data);
  },
  modify: async (emotionId, data) => {
    return updateSupabase(emotionId, data);
  },
  remove: async emotionId => {
    return deleteSupabase(emotionId);
  },
  isExist: async recordDate => {
    return hasDiaryForDaySupabase();
  },
};

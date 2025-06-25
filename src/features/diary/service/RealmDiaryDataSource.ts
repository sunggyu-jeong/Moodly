import { DiaryDataSource } from './DiaryDataSource';
import {
  createDiaryRealm,
  deleteDiaryRealm,
  hasDiaryForDayRealm,
  selectDiaryByIdRealm,
  selectDiaryByMonthRealm,
  selectDiaryCountRealm,
  updateDiaryRealm,
} from './EmotionDiaryService';

export const realmDiaryDataSource: DiaryDataSource = {
  searchCount: async realm => {
    return selectDiaryCountRealm(realm!);
  },
  searchById: async (realm, emotionId) => {
    return selectDiaryByIdRealm(realm, emotionId);
  },
  searchByMonth: async (realm, recordDate) => {
    return selectDiaryByMonthRealm(realm, recordDate);
  },
  add: async (realm, data) => {
    return createDiaryRealm(realm, data);
  },
  modify: async (realm, emotionId, data) => {
    return updateDiaryRealm(realm, emotionId, data);
  },
  remove: async (realm, emotionId) => {
    await deleteDiaryRealm(realm, emotionId);
  },
  isExist: async (realm, recordDate) => {
    return hasDiaryForDayRealm(realm, recordDate);
  },
};

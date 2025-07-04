import { isEmpty } from '@shared/lib';
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
    if (isEmpty(realm)) {
      throw new Error('searchCount: realm is required');
    }
    return selectDiaryCountRealm(realm);
  },
  searchById: async (realm, emotionId) => {
    if (isEmpty(realm)) {
      throw new Error('searchById: realm is required');
    }
    if (isEmpty(emotionId)) {
      throw new Error('searchById: emotionId is required');
    }
    return selectDiaryByIdRealm(realm, emotionId);
  },
  searchByMonth: async (realm, recordDate) => {
    if (isEmpty(realm)) {
      throw new Error('searchByMonth: realm is required');
    }
    if (isEmpty(recordDate)) {
      throw new Error('searchByMonth: recordDate is required');
    }
    return selectDiaryByMonthRealm(realm, recordDate);
  },
  add: async (realm, data) => {
    if (isEmpty(realm)) {
      throw new Error('add: realm is required');
    }
    if (isEmpty(data)) {
      throw new Error('add: data is required');
    }
    return createDiaryRealm(realm, data);
  },
  modify: async (realm, emotionId, data) => {
    if (isEmpty(realm)) {
      throw new Error('modify: realm is required');
    }
    if (isEmpty(emotionId)) {
      throw new Error('modify: emotionId is required');
    }
    if (isEmpty(data)) {
      throw new Error('modify: data is required');
    }
    return updateDiaryRealm(realm, emotionId, data);
  },
  remove: async (realm, emotionId) => {
    if (isEmpty(realm)) {
      throw new Error('remove: realm is required');
    }
    if (isEmpty(emotionId)) {
      throw new Error('remove: emotionId is required');
    }
    await deleteDiaryRealm(realm, emotionId);
  },
  isExist: async (realm, recordDate) => {
    if (isEmpty(realm)) {
      throw new Error('isExist: realm is required');
    }
    if (isEmpty(recordDate)) {
      throw new Error('isExist: recordDate is required');
    }
    return hasDiaryForDayRealm(realm, recordDate);
  },
};

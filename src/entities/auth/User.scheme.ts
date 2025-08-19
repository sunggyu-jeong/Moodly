import dayjs from 'dayjs';

/**
 * 앱·사용자 단위 설정을 저장하기 위한 Realm 스키마
 */
export class UserMeta extends Realm.Object<UserMeta> {
  // 연결된 사용자 식별자
  user_id!: string;
  // 첫 가동 플래그
  is_first_load!: boolean;
  // 레코드 생성일
  created_at!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'UserMeta',
    primaryKey: 'user_id',
    properties: {
      user_id: 'string',
      is_first_load: { type: 'bool', default: true },
      created_at: { type: 'date', default: () => dayjs() },
    },
  };
}

export interface UserMetaDTO {
  userId: string;
  isFirstLoad: boolean;
}

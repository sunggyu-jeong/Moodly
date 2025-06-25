import { DiaryDataSource } from './DiaryDataSource';
import { realmDiaryDataSource } from './RealmDiaryDataSource';
import { supabaseDiaryDataSource } from './SupabaseDiaryDataSource';

export enum DataSourceType {
  REALM = 'REALM',
  SUPABASE = 'SUPABASE',
}

export function createDiaryDataSource(type: DataSourceType): DiaryDataSource {
  return type === DataSourceType.SUPABASE ? supabaseDiaryDataSource : realmDiaryDataSource;
}

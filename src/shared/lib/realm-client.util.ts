import Realm from 'realm';
import { EmotionDiary } from '../../entities/diary';

let _realm: Realm | null = null;

/**
 * 열린 Realm 인스턴스를 반환합니다.
 */
export async function initRealm(): Promise<Realm> {
  const _realm = await Realm.open({
    schema: [EmotionDiary],
    schemaVersion: 2,
    onMigration: (oldRealm: Realm, newRealm: Realm) => {
      if (oldRealm.schemaVersion < 2) {
        const oldDiaryObjects = oldRealm.objects('EmotionDiary');
        const newDiaryObjects = newRealm.objects('EmotionDiary');
        for (let i = 0; i < oldDiaryObjects.length; i++) {
          if ('id' in oldDiaryObjects[i]) {
            delete newDiaryObjects[i].id;
          }
        }
      }
    },
  });
  return _realm;
}

/**
 * 싱글톤 객체 반환
 */
export function getRealm(): Realm {
  if (!_realm) {
    throw new Error('Realm이 아직 초기화되지 않았습니다. 먼저 initRealm()을 호출하세요.');
  }
  return _realm;
}

/**
 * 열린 realm 정보 초기화
 */
export function closeRealm() {
  if (_realm && !_realm.isClosed) {
    _realm.close();
    _realm = null;
  }
}

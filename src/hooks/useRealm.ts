import { useCallback, useEffect, useRef, useState } from "react";
import Realm from "realm";
import { isNotEmpty } from "../utils";
import { EmotionDiary } from "../scheme";

export function useRealm() {
  const realmRef = useRef<Realm | null>(null);
  const [realm, setRealm] = useState<Realm | null>(null);

  const openRealm = useCallback(async () => {
    try {
      const realmInstance = await Realm.open({
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
      realmRef.current = realmInstance;
      setRealm(realmInstance);

      console.log("Realm opened at path:", realmInstance.path);
      return realmInstance;
    } catch (error) {
      console.error("Realm을 여는 도중 오류가 발생했습니다.", error);
    }
  }, []);

  // Realm 닫기
  const closeRealm = useCallback(() => {
    if (isNotEmpty(realmRef.current) && !realmRef.current.isClosed) {
      realmRef.current!.close();
      realmRef.current = null;
      setRealm(null);
      console.log("Realm closed.");
    }
  }, []);
  
  return { openRealm, closeRealm };
}
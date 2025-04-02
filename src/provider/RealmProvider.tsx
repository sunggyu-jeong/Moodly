import { RealmContext } from "@/context/RealmContext";
import { EmotionDiary } from "@/scheme/EmotionDiary.scheme";
import { isNotEmpty } from "@/utils";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Realm from "realm";

interface RealmProviderProps {
  children: ReactNode;
}

export const RealmProvider = ({ children }: RealmProviderProps) => {
  const realmRef = useRef<Realm | null>(null);
  const [realm, setRealm] = useState<Realm | null>(null);

  const openRealm = useCallback(async (): Promise<void> => {
    try {
      const realmInstance = await Realm.open({ schema: [EmotionDiary] });
      realmRef.current = realmInstance;
      setRealm(realmInstance);
    } catch(error) {
      console.error("Realm을 여는 도중 오류가 발생했습니다.", error);
    }
  }, [])

  const closeRealm = useCallback((): void => {
    if (isNotEmpty(realmRef.current) && !realmRef.current.isClosed) {
      realmRef.current.close();
      realmRef.current = null;
      setRealm(null);
    }
  }, [])

  useEffect(() => {
    openRealm();
    return () => {
      closeRealm();
    }
  }, [openRealm, closeRealm])

  return (
    <RealmContext.Provider value={{ realm, openRealm, closeRealm }}>
      {children}
    </RealmContext.Provider>
  )
}
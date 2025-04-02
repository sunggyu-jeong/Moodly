import { createContext } from "react";
import Realm from "realm";

export interface RealmContextType {
  realm: Realm | null;
  openRealm: () => Promise<void>;
  closeRealm: () => void;
}

export const RealmContext = createContext<RealmContextType | undefined>(undefined);
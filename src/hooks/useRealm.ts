import { RealmContext, RealmContextType } from "@/context/RealmContext";
import { useContext } from "react";

export const useRealm = (): RealmContextType => {
  const context = useContext(RealmContext);
  if (context === undefined) {
    throw new Error('useRealm must be used within a RealmProvider');
  }
  return context;
};
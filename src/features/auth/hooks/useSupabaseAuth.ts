import { useAppDispatch } from '@/shared/hooks';
import { supabase } from '@/shared/lib/supabase.util';
import { useEffect } from 'react';
import { initializeSessionThunk, setAuthState } from '../model/auth.slice';

export function useSupabaseAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      await dispatch(initializeSessionThunk());
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      dispatch(
        setAuthState({
          session,
          data: session?.user || null,
          error: null,
        })
      );
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);
}

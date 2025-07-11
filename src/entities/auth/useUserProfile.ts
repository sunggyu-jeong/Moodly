import { supabase } from '@shared/lib/supabase.util';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useUserProfile() {
  const [user, setUser] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session);
    }
    fetchProfile();
  }, []);

  return { user };
}

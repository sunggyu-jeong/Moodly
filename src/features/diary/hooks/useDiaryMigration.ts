import { EmotionDiary } from '@entities/diary';
import { baseFormatError } from '@shared/api/base';
import { getRealm } from '@shared/lib/realm-client.util';
import { supabase } from '@shared/lib/supabase.util';
import { AuthError } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

type MigrationStatus = 'idle' | 'loading' | 'success' | 'error';

export function useDiaryMigration() {
  const [status, setStatus] = useState<MigrationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const migrate = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      // 1) Realm에서 로컬 다이어리 전부 가져오기
      const realm = getRealm();
      const localDiaries = realm.objects<EmotionDiary>('EmotionDiary');
      if (localDiaries.length === 0) {
        setStatus('success');
        return;
      }

      // 2) Supabase 세션 확인
      const {
        data: { session },
        error: sessionErr,
      } = await supabase.auth.getSession();
      if (sessionErr) throw sessionErr as AuthError;
      if (!session) throw new Error('Supabase 세션이 없습니다.');

      const userId = session.user.id;

      // 3) Supabase에 업로드 처리
      const inserts = localDiaries.map(d => ({
        icon_id: d.icon_id,
        record_date: dayjs(d.record_date).toISOString().slice(0, 10),
        description: d.description,
        created_at: d.created_at.toISOString(),
        updated_at: d.updated_at.toISOString(),
        user_id: userId,
      }));

      const { error: insertErr } = await supabase.from('moodly_diary').insert(inserts);

      if (insertErr) throw insertErr;

      // 4) 성공 시 Realm 데이터 전부 삭제
      realm.write(() => {
        realm.delete(localDiaries);
      });

      setStatus('success');
    } catch (err) {
      const formatted = err instanceof AuthError ? baseFormatError(err) : (err as Error);
      setError(formatted?.message ?? String(err));
      setStatus('error');
    }
  }, []);

  return { migrate, status, error };
}

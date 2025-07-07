// src/services/EmotionDiaryService.ts
import store from '@app/store';
import { EmotionDiaryDTO, EmotionDiarySupabase, mapSupabaseToDTO } from '@entities/diary';
import { isEmpty } from '@shared/lib';
import { supabase } from '@shared/lib/supabase.util';
import { PostgrestError } from '@supabase/supabase-js';

/** Supabase 스키마 정의 */
interface Database {
  public: {
    Tables: {
      moodly_diary: {
        Row: EmotionDiarySupabase;
        Insert: Omit<EmotionDiarySupabase, 'emotion_id'>;
        Update: Partial<Omit<EmotionDiarySupabase, 'emotion_id'>>;
      };
    };
    Views: object;
    Functions: object;
    Enums: object;
  };
}

export async function countSupabase(): Promise<number> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const { count, error } = await supabase
    .from('moodly_diary')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', id);
  if (error) throw error;
  return count ?? 0;
}

export async function hasDiaryForDaySupabase(): Promise<boolean> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const today = new Date();
  const yyyyMMdd = today.toISOString().slice(0, 10);

  const { count, error } = await supabase
    .from('moodly_diary')
    .select('*', { count: 'exact', head: true })
    .eq('record_date', yyyyMMdd)
    .eq('user_id', id);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function selectByMonthSupabase(recordDate: Date): Promise<EmotionDiaryDTO[]> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const year = recordDate.getFullYear();
  const month = recordDate.getMonth();
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 1, 0, 0, 0);

  const { data, error } = await supabase
    .from('moodly_diary')
    .select('*')
    .gte('record_date', start.toISOString())
    .eq('user_id', id)
    .lt('record_date', end.toISOString())
    .order('record_date', { ascending: false });
  if (error) throw error;
  return data.map(mapSupabaseToDTO) ?? [];
}

export async function selectByIdSupabase(emotionId: number): Promise<EmotionDiaryDTO | null> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const { data, error } = await supabase
    .from('moodly_diary')
    .select('*')
    .eq('emotion_id', emotionId)
    .eq('user_id', id)
    .single();
  if (error) {
    if ((error as PostgrestError).code === 'PGRST116') return null;
    throw error;
  }
  return mapSupabaseToDTO(data) ?? null;
}

export async function createSupabase(
  dto: Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const now = new Date().toISOString();
  const payload: Database['public']['Tables']['moodly_diary']['Insert'] = {
    icon_id: dto.iconId!,
    record_date: now!,
    description: dto.description || '',
    created_at: now,
    updated_at: now,
    user_id: id,
  };

  const { data, error } = await supabase
    .from('moodly_diary')
    .insert(payload)
    .select('emotion_id')
    .single();
  if (error) throw error;
  return data.emotion_id;
}

export async function updateSupabase(
  emotionId: number,
  updates: Partial<Omit<EmotionDiarySupabase, 'emotionId'>>
): Promise<number> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const now = new Date().toISOString();
  const payload: Database['public']['Tables']['moodly_diary']['Update'] = {
    updated_at: now,
    ...(updates.icon_id !== undefined && { icon_id: updates.icon_id }),
    ...(updates.record_date !== undefined && { record_date: updates.record_date }),
    ...(updates.description !== undefined && { description: updates.description }),
  };

  const { data: updated, error } = await supabase
    .from('moodly_diary')
    .update(payload)
    .eq('emotion_id', emotionId)
    .eq('user_id', id)
    .select('emotion_id')
    .single();
  if (error) throw error;
  return updated.emotion_id;
}

export async function deleteSupabase(emotionId: number): Promise<void> {
  const userInfo = store.getState().authSlice.userInfo;
  if (isEmpty(userInfo.data?.data?.id)) throw new Error('인증이 유효하지 않습니다.');
  const id = userInfo.data?.data?.id as string;

  const { error } = await supabase
    .from('moodly_diary')
    .delete()
    .eq('emotion_id', emotionId)
    .eq('user_id', id);
  if (error) throw error;
}

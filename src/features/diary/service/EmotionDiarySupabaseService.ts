// src/services/EmotionDiaryService.ts
import { EmotionDiaryDTO } from '@/entities/diary';
import { HOT_UPDATER_SUPABASE_ANON_KEY, HOT_UPDATER_SUPABASE_URL } from '@env';
import { createClient, PostgrestError } from '@supabase/supabase-js';

/** Supabase 스키마 정의 */
interface Database {
  public: {
    Tables: {
      emotion_diary: {
        Row: EmotionDiaryDTO;
        Insert: Omit<EmotionDiaryDTO, 'emotion_id'>;
        Update: Partial<Omit<EmotionDiaryDTO, 'emotion_id'>>;
      };
    };
    Views: object;
    Functions: object;
    Enums: object;
  };
}

// Supabase 초기화
const supabase = createClient<Database>(HOT_UPDATER_SUPABASE_URL!, HOT_UPDATER_SUPABASE_ANON_KEY!);

export async function countSupabase(): Promise<number> {
  const { count, error } = await supabase
    .from('emotion_diary')
    .select('*', { count: 'exact', head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function hasDiaryForDaySupabase(recordDate: Date): Promise<boolean> {
  const start = new Date(recordDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { count, error } = await supabase
    .from('emotion_diary')
    .select('*', { count: 'exact', head: true })
    .gte('record_date', start.toISOString())
    .lt('record_date', end.toISOString());
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function selectByMonthSupabase(recordDate: Date): Promise<EmotionDiaryDTO[]> {
  const year = recordDate.getFullYear();
  const month = recordDate.getMonth();
  const start = new Date(year, month, 1, 0, 0, 0);
  const end = new Date(year, month + 1, 1, 0, 0, 0);

  const { data, error } = await supabase
    .from('emotion_diary')
    .select('*')
    .gte('record_date', start.toISOString())
    .lt('record_date', end.toISOString())
    .order('record_date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function selectByIdSupabase(emotionId: number): Promise<EmotionDiaryDTO | null> {
  const { data, error } = await supabase
    .from('emotion_diary')
    .select('*')
    .eq('emotion_id', emotionId)
    .single();
  if (error) {
    if ((error as PostgrestError).code === 'PGRST116') return null;
    throw error;
  }
  return data ?? null;
}

export async function createSupabase(
  dto: Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'>
): Promise<number> {
  const now = new Date().toISOString();
  const payload: Database['public']['Tables']['emotion_diary']['Insert'] = {
    iconId: dto.iconId!,
    recordDate: dto.recordDate!,
    description: dto.description || '',
    createdAt: now,
    updatedAt: now,
  };

  const { data, error } = await supabase
    .from('emotion_diary')
    .insert(payload)
    .select('emotion_id')
    .single();
  if (error) throw error;
  return data.emotion_id;
}

export async function updateSupabase(
  emotionId: number,
  updates: Partial<Omit<EmotionDiaryDTO, 'emotionId'>>
): Promise<number> {
  const now = new Date().toISOString();
  const payload: Database['public']['Tables']['emotion_diary']['Update'] = {
    updatedAt: now,
    ...(updates.iconId !== undefined && { icon_id: updates.iconId }),
    ...(updates.recordDate !== undefined && { record_date: updates.recordDate }),
    ...(updates.description !== undefined && { description: updates.description }),
  };

  const { data: updated, error } = await supabase
    .from('emotion_diary')
    .update(payload)
    .eq('emotion_id', emotionId)
    .select('emotion_id')
    .single();
  if (error) throw error;
  return updated.emotion_id;
}

export async function deleteSupabase(emotionId: number): Promise<void> {
  const { error } = await supabase.from('emotion_diary').delete().eq('emotion_id', emotionId);
  if (error) throw error;
}

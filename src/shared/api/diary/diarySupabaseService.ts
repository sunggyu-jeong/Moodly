import { ApiResponse } from '@entities/common/response';
import { EmotionDiaryDTO, EmotionDiarySupabase, mapSupabaseToDTO } from '@entities/diary';
import { AuthError } from '@supabase/supabase-js';
import { ApiCode } from '../../config/errorCodes';
import { isNotEmpty } from '../../lib';
import { supabase } from '../../lib/supabase.util';
import { baseFormatError } from '../base';

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

export async function getDiaryCount(): Promise<ApiResponse<number>> {
  try {
    const response = await supabase.auth.getSession();
    const { count, error } = await supabase
      .from('moodly_diary')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', response.data.session?.user.id);
    if (error) throw error;
    return { data: count ?? 0 };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

export async function hasDiaryForDay(): Promise<ApiResponse<boolean>> {
  try {
    const response = await supabase.auth.getSession();
    const today = new Date();
    const yyyyMMdd = today.toISOString().slice(0, 10);

    const { count, error } = await supabase
      .from('moodly_diary')
      .select('*', { count: 'exact', head: true })
      .eq('record_date', yyyyMMdd)
      .eq('user_id', response.data.session?.user.id);

    if (error) throw error;
    return { data: (count ?? 0) > 0 };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

export async function selectByMonth(
  startDate: string,
  endDate: string
): Promise<ApiResponse<EmotionDiaryDTO[]>> {
  try {
    const response = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('moodly_diary')
      .select('*')
      .gte('record_date', startDate)
      .eq('user_id', response.data.session?.user.id)
      .lt('record_date', endDate)
      .order('record_date', { ascending: false });
    if (error) throw error;
    return { data: data.map(mapSupabaseToDTO) ?? [] };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

export async function selectById(emotionId: number): Promise<ApiResponse<EmotionDiaryDTO>> {
  try {
    const response = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('moodly_diary')
      .select('*')
      .eq('emotion_id', emotionId)
      .eq('user_id', response.data.session?.user.id)
      .single();
    if (error) throw error;
    return { data: mapSupabaseToDTO(data) ?? null };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

export async function createDiary(
  dto: Omit<EmotionDiaryDTO, 'emotionId' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<number>> {
  try {
    const response = await supabase.auth.getSession();
    const now = new Date().toISOString();
    const payload: Database['public']['Tables']['moodly_diary']['Insert'] = {
      icon_id: dto.iconId!,
      record_date: now!,
      description: dto.description || '',
      created_at: now,
      updated_at: now,
      user_id: response.data.session?.user.id || '',
    };
    const { data, error } = await supabase
      .from('moodly_diary')
      .insert(payload)
      .select('emotion_id')
      .single();
    if (error) throw error;
    return { data: data.emotion_id };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

export async function updateDiary(
  emotionId: number,
  updates: Partial<Omit<EmotionDiaryDTO, 'emotionId'>>
): Promise<ApiResponse<number>> {
  try {
    const response = await supabase.auth.getSession();
    const now = new Date().toISOString();
    const payload: Database['public']['Tables']['moodly_diary']['Update'] = {
      updated_at: now,
      ...(isNotEmpty(updates.iconId) && { icon_id: updates.iconId }),
      ...(isNotEmpty(updates.recordDate) && { record_date: updates.recordDate }),
      ...(isNotEmpty(updates.description) && { description: updates.description }),
    };

    const { data: updated, error } = await supabase
      .from('moodly_diary')
      .update(payload)
      .eq('emotion_id', emotionId)
      .eq('user_id', response.data.session?.user.id)
      .select('emotion_id')
      .single();
    if (error) throw error;
    return { data: updated.emotion_id };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

export async function deleteDiary(emotionId: number): Promise<ApiResponse<string>> {
  try {
    const response = await supabase.auth.getSession();
    const { error } = await supabase
      .from('moodly_diary')
      .delete()
      .eq('emotion_id', emotionId)
      .eq('user_id', response.data.session?.user.id);
    if (error) throw error;
    return { data: ApiCode.SUCCESS };
  } catch (err) {
    throw baseFormatError(err as AuthError);
  }
}

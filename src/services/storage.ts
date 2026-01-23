import { createClient } from '@supabase/supabase-js';
import { GuestbookEntry } from '../types';

// =================================================================
// ⚠️ TODO: Replace these with your actual Supabase Project details
// 1. Go to https://supabase.com -> Create Project
// 2. Settings -> API -> Copy "Project URL" and "anon public key"
// =================================================================
const SUPABASE_URL = 'https://ibcndkxbmycktuxmccnd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliY25ka3hibXlja3R1eG1jY25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MDc3NTgsImV4cCI6MjA4MTA4Mzc1OH0.t9VsuBiq4X9vfQ2--TzwUc5TQA1LUQdhk4hUePS0gvE';

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 보안을 위한 고유 솔트값 (해싱의 복잡도를 높임)
const PASSWORD_SALT = 'jongho_inhee_wedding_2026_secure_key';

// --- Helper Functions ---

/**
 * 비밀번호를 SHA-256으로 해싱합니다.
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + PASSWORD_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
// --- Guestbook API ---

export const getGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading guestbook:', error);
      return [];
    }

    // Map Supabase 'created_at' to our app's 'date' field
    return (data || []).map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      message: item.message,
      password: item.password,
      date: item.created_at,
    }));
  } catch (e) {
    console.error('Unexpected error fetching guestbook:', e);
    return [];
  }
};

export const addGuestbookEntry = async (entry: Omit<GuestbookEntry, 'id' | 'date'>): Promise<GuestbookEntry> => {
  try {
    const hashedPassword = entry.password ? await hashPassword(entry.password) : undefined;

    const { data, error } = await supabase
      .from('guestbook')
      .insert([
        {
          name: entry.name,
          message: entry.message,
          password: hashedPassword,
        }
      ])
      .select() // Select the inserted row to get the generated ID and Date
      .single();

    if (error) throw error;

    return {
      id: data.id.toString(),
      name: data.name,
      message: data.message,
      password: data.password,
      date: data.created_at,
    };
  } catch (e) {
    console.error('Failed to add entry:', e);
    throw e;
  }
};

/**
 * 비밀번호를 확인하여 방명록 글을 삭제합니다.
 */
export const deleteGuestbookEntry = async (id: string, password?: string): Promise<boolean> => {
  try {
    const inputHash = await hashPassword(password);

    // id와 password가 모두 일치하는 행을 삭제 시도
    const { error, count } = await supabase
      .from('guestbook')
      .delete({ count: 'exact' })
      .eq('id', id)
      .eq('password', inputHash);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    // 영향을 받은 행의 수가 1개 이상이면 삭제 성공
    return count !== null && count > 0;
  } catch (e) {
    console.error('Unexpected error during delete:', e);
    return false;
  }
};

// --- Likes API ---

export const getLikes = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('count')
      .eq('id', 'main')
      .single();

    if (error) {
      // If table doesn't exist or row missing, fail gracefully
      console.warn('Could not fetch likes:', error.message);
      return 0;
    }
    return data?.count || 0;
  } catch (e) {
    return 0;
  }
};

export const incrementLike = async (): Promise<number> => {
  try {
    // RPC is better for atomicity, but simple update is fine for this scale.
    // First, get current count
    const { data: currentData } = await supabase
      .from('likes')
      .select('count')
      .eq('id', 'main')
      .single();

    const currentCount = currentData?.count || 0;
    const newCount = currentCount + 1;

    // Update
    const { error } = await supabase
      .from('likes')
      .update({ count: newCount })
      .eq('id', 'main');

    if (error) throw error;

    return newCount;
  } catch (e) {
    console.error('Failed to increment like:', e);
    return 0;
  }
};
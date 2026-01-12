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
      date: item.created_at,
    }));
  } catch (e) {
    console.error('Unexpected error fetching guestbook:', e);
    return [];
  }
};

export const addGuestbookEntry = async (entry: Omit<GuestbookEntry, 'id' | 'date'>): Promise<GuestbookEntry> => {
  try {
    const { data, error } = await supabase
      .from('guestbook')
      .insert([
        {
          name: entry.name,
          message: entry.message
        }
      ])
      .select() // Select the inserted row to get the generated ID and Date
      .single();

    if (error) throw error;

    return {
      id: data.id.toString(),
      name: data.name,
      message: data.message,
      date: data.created_at,
    };
  } catch (e) {
    console.error('Failed to add entry:', e);
    throw e;
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
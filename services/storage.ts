import { GuestbookEntry } from '../types';

const STORAGE_KEYS = {
  GUESTBOOK: 'wedding_guestbook_v1',
  LIKES: 'wedding_likes_v1',
  HAS_LIKED: 'wedding_has_liked_v1',
};

// Initial mock data
const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  { id: '1', name: '김철수', message: '결혼 진심으로 축하드립니다! 행복하세요.', date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', name: '이미영', message: '너무 아름다운 커플이에요 💕', date: new Date(Date.now() - 172800000).toISOString() },
];

export const getGuestbookEntries = (): GuestbookEntry[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.GUESTBOOK);
  if (!stored) {
    // Determine if we should seed initial data (only if empty)
    localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(INITIAL_GUESTBOOK));
    return INITIAL_GUESTBOOK;
  }
  return JSON.parse(stored);
};

export const addGuestbookEntry = (entry: Omit<GuestbookEntry, 'id' | 'date'>): GuestbookEntry => {
  const entries = getGuestbookEntries();
  const newEntry: GuestbookEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  const updated = [newEntry, ...entries];
  localStorage.setItem(STORAGE_KEYS.GUESTBOOK, JSON.stringify(updated));
  return newEntry;
};

export const getLikes = (): number => {
  const stored = localStorage.getItem(STORAGE_KEYS.LIKES);
  return stored ? parseInt(stored, 10) : 154; // Start with some likes for social proof
};

export const toggleLike = (): { count: number; liked: boolean } => {
  const currentLikes = getLikes();
  const hasLiked = localStorage.getItem(STORAGE_KEYS.HAS_LIKED) === 'true';

  let newCount = currentLikes;
  let newHasLiked = false;

  if (hasLiked) {
    newCount = Math.max(0, currentLikes - 1);
    newHasLiked = false;
  } else {
    newCount = currentLikes + 1;
    newHasLiked = true;
  }

  localStorage.setItem(STORAGE_KEYS.LIKES, newCount.toString());
  localStorage.setItem(STORAGE_KEYS.HAS_LIKED, newHasLiked.toString());

  return { count: newCount, liked: newHasLiked };
};

export const checkHasLiked = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.HAS_LIKED) === 'true';
};
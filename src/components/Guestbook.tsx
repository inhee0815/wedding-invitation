import React, { useState, useEffect } from 'react';
import { GuestbookEntry } from '../types';
import { getGuestbookEntries, addGuestbookEntry } from '../services/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Cloud } from 'lucide-react';

const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getGuestbookEntries();
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          setEntries([]);
        }
      } catch (error) {
        console.error("Failed to load guestbook", error);
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    try {
      const newEntry = await addGuestbookEntry({ name, message });
      setEntries([newEntry, ...entries]);
      setName('');
      setMessage('');
    } catch (error) {
      console.error("Failed to save entry", error);
      alert("저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };


  const formatDate = (isoString: string) => {
    try {
      if (!isoString) return '';
      return isoString.split('T')[0];
    } catch {
      return '';
    }
  };

  return (
    <section className="py-16 px-6 bg-paper">
      <div className="max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <span className="text-wood-800 text-sm tracking-widest font-serif border-b border-wood-300 pb-1">GUESTBOOK</span>
          <div className="flex items-center gap-1 mt-4 text-xs text-stone-500">
            <span>방명록</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-sm border border-stone-100">
          <div className="mb-4">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-stone-300 py-2 px-1 text-sm focus:outline-none focus:border-wood-800 transition-colors bg-transparent placeholder-stone-400"
              maxLength={10}
              required
            />
          </div>
          <div className="mb-6">
            <textarea
              placeholder="축하 메시지를 남겨주세요"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-stone-300 rounded-md p-3 text-sm focus:outline-none focus:border-wood-800 transition-colors bg-stone-50 placeholder-stone-400 h-24 resize-none"
              maxLength={100}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-wood-800 text-white py-3 text-sm tracking-widest hover:bg-wood-900 transition-colors disabled:opacity-50 rounded-lg "
          >
            {isSubmitting ? '저장중...' : '등록하기'}
          </button>
        </form>

        <ul className="space-y-4 min-h-[200px]">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <span className="text-stone-400 text-xs animate-pulse">메시지 불러오는 중...</span>
            </div>
          ) : (
            <AnimatePresence>
              {(entries || []).slice(0, visibleCount).map((entry) => (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-stone-100"
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-bold text-wood-900 text-sm">{entry.name}</span>
                    <span className="text-[12px] text-stone-400">{formatDate(entry.date)}</span>
                  </div>
                  <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed font-hand">{entry.message}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          )}
        </ul>
        {!isLoading && (entries || []).length > visibleCount && (
          <div className="text-center mt-6">
            <button onClick={handleShowMore} className="w-full py-3 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-100 transition-colors flex items-center justify-center gap-1"
            >
              더보기 <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;
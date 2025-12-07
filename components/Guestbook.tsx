import React, { useState, useEffect } from 'react';
import { GuestbookEntry } from '../types';
import { getGuestbookEntries, addGuestbookEntry } from '../services/storage';
import { motion, AnimatePresence } from 'framer-motion';

const Guestbook: React.FC = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEntries(getGuestbookEntries());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newEntry = addGuestbookEntry({ name, message });
      setEntries([newEntry, ...entries]);
      setName('');
      setMessage('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <section className="py-16 px-6 bg-paper">
      <div className="max-w-md mx-auto">
        <h3 className="text-center font-serif text-xl text-wood-800 mb-8 border-b border-wood-200 pb-4 inline-block w-full">GUESTBOOK</h3>

        <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-lg shadow-sm border border-stone-100">
          <div className="mb-4">
            <input
              type="text"
              placeholder="이름 (Name)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-stone-300 py-2 px-1 text-sm focus:outline-none focus:border-wood-800 transition-colors bg-transparent placeholder-stone-400"
              maxLength={10}
              required
            />
          </div>
          <div className="mb-6">
            <textarea
              placeholder="축하 메시지를 남겨주세요 (Message)"
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
            className="w-full bg-wood-800 text-white py-3 text-sm tracking-widest hover:bg-wood-900 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'SENDING...' : '등록하기'}
          </button>
        </form>

        <ul className="space-y-4">
          <AnimatePresence>
            {entries.slice(0, 10).map((entry) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-stone-100"
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bold text-wood-900 text-sm">{entry.name}</span>
                  <span className="text-[10px] text-stone-400">{entry.date.split('T')[0]}</span>
                </div>
                <p className="text-stone-600 text-sm whitespace-pre-wrap leading-relaxed font-hand">{entry.message}</p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {entries.length > 10 && (
          <div className="text-center mt-6">
            <button className="text-xs text-stone-500 underline decoration-stone-300">더보기</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;
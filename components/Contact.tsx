import React, { useState } from 'react';
import { Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactGroupProps {
  title: string;
  people: { name: string; role: string; phone: string }[];
}

const ContactGroup: React.FC<ContactGroupProps> = ({ title, people }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex justify-between items-center bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <span className="font-serif text-wood-900 font-medium">{title} 측 연락처</span>
        {isOpen ? <ChevronUp size={18} className="text-stone-400"/> : <ChevronDown size={18} className="text-stone-400"/>}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {people.map((person, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-stone-100 last:border-0 pb-3 last:pb-0">
                  <div>
                    <span className="text-xs text-stone-400 block mb-0.5">{person.role}</span>
                    <span className="text-stone-800 font-medium">{person.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <a href={`tel:${person.phone}`} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100">
                      <Phone size={18} />
                    </a>
                    <a href={`sms:${person.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100">
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Contact: React.FC = () => {
  return (
    <section className="py-16 px-6 bg-paper">
      <div className="text-center mb-8">
        <span className="text-wood-800 text-sm tracking-widest font-serif border-b border-wood-300 pb-1">CONTACT</span>
        <p className="mt-4 text-stone-500 text-xs">축하의 마음을 전해주세요</p>
      </div>

      <div className="max-w-md mx-auto">
        <ContactGroup 
          title="신랑" 
          people={[
            { name: "이종호", role: "신랑", phone: "010-0000-0000" },
            { name: "김판수", role: "아버지", phone: "010-0000-0000" },
            { name: "이영자", role: "어머니", phone: "010-0000-0000" }
          ]} 
        />
        <ContactGroup 
          title="신부" 
          people={[
            { name: "김인희", role: "신부", phone: "010-0000-0000" },
            { name: "박명훈", role: "아버지", phone: "010-0000-0000" },
            { name: "최수진", role: "어머니", phone: "010-0000-0000" }
          ]} 
        />
      </div>
    </section>
  );
};

export default Contact;
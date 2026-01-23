import React, { useState } from 'react';
import { Phone, MessageCircle, ChevronDown, ChevronUp, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactGroupProps {
  title: string;
  people: { name: string; role: string; phone: string; bank?: string; account?: string, payImageUrl?: string; payUrl?: string }[];
}

const ContactGroup: React.FC<ContactGroupProps> = ({ title, people }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopyAccount = (account?: string) => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    // 2. 현재 복사한 계좌번호를 상태에 저장
    setCopiedAccount(account);

    // 2초 후 초기화
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex justify-between items-center bg-stone-50 hover:bg-stone-100 transition-colors"
      >
        <span className="font-serif text-wood-900 font-medium">{title} 측 연락처</span>
        {isOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-6"> {/* 간격을 조금 더 넓혔습니다 */}
              {people.map((person, idx) => (
                // 각 인물을 감싸는 최상위 div (key 위치)
                <div key={idx} className="space-y-3">
                  {/* 연락처 영역 */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-gothic text-xs text-stone-400 block mb-0.5">{person.role}</span>
                      <span className="font-gothic text-[14px] text-stone-800 font-bold">{person.name}</span>
                    </div>
                    <div className="flex gap-3">
                      {/* Pay Button next to Phone/SMS */}
                      {person.payUrl && (
                        <a
                          href={person.payUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-[#FFEB00] text-[#191919] rounded-full hover:brightness-95 active:scale-95 transition-all flex items-center justify-center shadow-sm overflow-hidden"
                          title="페이 송금"
                        >
                          {person.payImageUrl ? (
                            <img
                              src={person.payImageUrl}
                              alt="KakaoPay"
                            />
                          ) : (
                            <span className="text-[9px] font-black italic leading-none tracking-tighter">pay</span>
                          )}
                        </a>
                      )}
                      <a href={`tel:${person.phone}`} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-200 transition-colors">
                        <Phone size={18} />
                      </a>
                      <a href={`sms:${person.phone}`} className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                        <MessageCircle size={18} />
                      </a>
                    </div>
                  </div>

                  {/* 계좌 정보 영역 (데이터가 있을 때만 노출) */}
                  {person.account && (
                    <div className="flex items-center justify-between bg-stone-50/80 rounded-xl p-3 border border-stone-100">
                      <div className="text-[13px] text-stone-600">
                        <span className="font-medium mr-2">{person.bank}</span>
                        <span className="font-sans tabular-nums tracking-tight">{person.account}</span>
                      </div>
                      <button
                        onClick={() => handleCopyAccount(person.account)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all bg-white text-stone-500 border border-stone-200`}
                      >
                        {copiedAccount === person.account ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        {copiedAccount === person.account ? "완료" : "복사"}
                      </button>
                    </div>
                  )}

                  {/* 마지막 요소가 아니면 구분선 표시 */}
                  {idx !== people.length - 1 && <div className="border-b border-stone-100 pt-3" />}
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
        <span className="text-wood-800 text-sm tracking-widest font-cinzel font-medium border-b border-wood-300 pb-1">CONTACT</span>
        <p className="mt-4 text-stone-500 text-xs font-gothic">마음 전하실 곳</p>
        <p className="mt-4 text-stone-500 text-[10px] font-gothic">참석이 어려우신 분들을 위해 기재했습니다
          <br />
          너른 마음으로 양해 부탁드립니다</p>
      </div>

      <div className="max-w-md mx-auto">
        <ContactGroup
          title="신랑"
          people={[
            {
              name: "이종호", role: "신랑", phone: "010-2087-8630", bank: "신한", account: "110-441-812826", payUrl: "https://qr.kakaopay.com/Ej7rxN2z1",
              payImageUrl: "images/payment_icon_yellow_small.png"
            },
            { name: "이우홍", role: "아버지", phone: "010-6754-8630", bank: "하나", account: "139-910270-39707" },
            { name: "이현주", role: "어머니", phone: "010-6679-8630", bank: "농협", account: "221157-56-012503" }
          ]}
        />
        <ContactGroup
          title="신부"
          people={[
            {
              name: "김인희", role: "신부", phone: "010-5006-7909", bank: "카카오뱅크", account: "3333-07-6351378", payUrl: "https://qr.kakaopay.com/Ej9G6v3NR",
              payImageUrl: "images/payment_icon_yellow_small.png"
            },
            { name: "김수원", role: "아버지", phone: "010-2253-7909", bank: "KB국민", account: "223-01-0061-859" },
            { name: "윤영미", role: "어머니", phone: "010-4166-7909", bank: "KB국민", account: "016-21-0367-427" }
          ]}
        />
      </div>
    </section>
  );
};

export default Contact;

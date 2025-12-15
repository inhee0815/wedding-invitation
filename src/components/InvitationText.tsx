import React from 'react';
import { motion } from 'framer-motion';

const InvitationText: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
      className="px-8 pb-16 pt-0 text-center bg-paper text-wood-900 relative z-20"
    >
      <div className="pt-12">
        <h3 className="font-serif text-2xl mb-8 text-wood-800">초대합니다</h3>
        <p className="font-hand text-lg leading-9 mb-8 text-stone-600">
          서로가 마주 보며 다져온 사랑을<br />
          이제 함께 한곳을 바라보며<br />
          걸어가려 합니다.<br /><br />
          저희 두 사람의 새로운 시작을<br />
          가까이에서 축복해 주시면<br />
          더없는 기쁨으로 간직하겠습니다.
        </p>

        <div className="mt-12 grid grid-cols-[auto_auto_auto_auto] gap-x-1 gap-y-4 items-center justify-center font-sans text-stone-700">

          {/* Groom Side */}
          <div className="text-right font-medium text-lg whitespace-nowrap">
            이우홍 · 이현주
          </div>
          <div className="text-left whitespace-nowrap">
            의
          </div>
          <div className="text-center whitespace-nowrap w-8">
            아들
          </div>
          <div className="text-left font-bold text-xl whitespace-nowrap pl-1">
            종호
          </div>

          {/* Bride Side */}
          <div className="text-right font-medium text-lg whitespace-nowrap">
            김수원 · 윤영미
          </div>
          <div className="text-left whitespace-nowrap">
            의
          </div>
          <div className="text-center whitespace-nowrap w-8">
            딸
          </div>
          <div className="text-left font-bold text-xl whitespace-nowrap pl-1">
            인희
          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default InvitationText;
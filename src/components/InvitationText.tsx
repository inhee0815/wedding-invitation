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

        <div className="mt-12 space-y-2 font-sans text-stone-700">
          <p>
            <span className="font-medium text-lg">이우홍 · 이현주</span> 의 아들 <span className="font-bold text-xl ml-2">종호</span>
          </p>
          <p>
            <span className="font-medium text-lg">김수원 · 윤영미</span> 의 딸 <span className="font-bold text-xl ml-2">인희</span>
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default InvitationText;
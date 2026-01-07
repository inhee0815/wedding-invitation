import React from 'react';
import { Share2, Copy } from 'lucide-react';

const Share: React.FC = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('주소가 복사되었습니다.');
  };

  const handleKakaoShare = () => {
    if (window.Kakao) {
      const kakao = window.Kakao

      if (!kakao.isInitialized()) {
        kakao.init('1d95cef4fde1471e53b221c7d0398662')
      }

      kakao.Share.sendCustom({
        templateId: 127052,
        templateArgs: {
        },
      });
      console.log('카카오톡 공유하기 기능을 실행합니다.');
    } else {
      console.error('카카오톡 SDK가 로드되지 않았습니다.');
    }
  };

  return (
    <section className="py-12 px-6 bg-stone-100 text-center">
      <div className="flex justify-center gap-4">
        <button
          onClick={handleKakaoShare}
          className="flex items-center gap-2 bg-[#FEE500] text-[#000000] px-6 py-3 rounded-md font-gothic text-sm font-bold hover:bg-[#FDD835] transition-colors"
        >
          <Share2 size={16} /> 카카오톡 공유
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-white text-stone-700 border border-stone-200 px-6 py-3 rounded-md font-gothic text-sm font-bold hover:bg-stone-50 transition-colors"
        >
          <Copy size={16} /> 주소 복사
        </button>
      </div>
      <footer className="mt-12 text-[10px] text-stone-400">
        <p>Designed by Inhee</p>
        <p className="mt-1">Copyright © 2026 Jongho & Inhee</p>
      </footer>
    </section>
  );
};

export default Share;
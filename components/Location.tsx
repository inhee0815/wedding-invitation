import React, { useState } from 'react';
import { MapPin, Copy, Check } from 'lucide-react';

const Location: React.FC = () => {
  const mapUrl = "https://map.kakao.com/link/map/가천컨벤션센터,37.448552,127.127027"; // Approximate coords for Gachon Convention
  const address = "경기 성남시 수정구 성남대로 1342 (태평동 650)";
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 px-6 bg-white">
      <div className="text-center mb-8">
        <span className="text-wood-800 text-sm tracking-widest font-serif border-b border-wood-300 pb-1">LOCATION</span>
        <h3 className="mt-6 text-xl font-bold text-wood-900">가천컨벤션센터</h3>
        <p className="mt-2 text-stone-600 text-sm">{address}</p>
        <button 
          onClick={handleCopyAddress}
          className="mt-3 text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:bg-stone-50"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? "복사되었습니다" : "주소 복사"}
        </button>
      </div>

      <div className="w-full aspect-video bg-stone-200 rounded-lg overflow-hidden relative mb-6">
         {/* Placeholder for map */}
         <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400">
             <span className="text-sm">지도 로딩중... (Map)</span>
         </div>
         {/* In a real app, you would use the Kakao Map SDK script here */}
         <img 
            src="https://picsum.photos/800/400?blur=2" 
            className="w-full h-full object-cover opacity-50" 
            alt="Map Preview" 
         />
         <div className="absolute inset-0 flex items-center justify-center">
             <a 
               href={mapUrl} 
               target="_blank" 
               rel="noopener noreferrer"
               className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-wood-900 text-sm font-bold hover:bg-white transition-colors"
             >
                <MapPin size={16} /> 지도 보기
             </a>
         </div>
      </div>

      <div className="space-y-4 text-sm text-stone-600 max-w-md mx-auto bg-paper p-6 rounded-lg">
        <div>
           <strong className="text-wood-800 block mb-1">🚇 지하철</strong>
           <p className="text-xs">수인분당선 <span className="font-bold text-yellow-600">가천대역</span> 1번 출구<br/>(비전타워 통로 연결)</p>
        </div>
        <div>
           <strong className="text-wood-800 block mb-1">🚌 버스</strong>
           <p className="text-xs">가천대역.가천대학교 하차<br/>간선 302, 303, 333, 440 등</p>
        </div>
        <div>
           <strong className="text-wood-800 block mb-1">🚗 자가용 / 주차</strong>
           <p className="text-xs">네비게이션 '가천컨벤션센터' 또는 '가천대학교 비전타워'<br/>비전타워 주차장 B3~B4층 이용</p>
        </div>
      </div>
    </section>
  );
};

export default Location;
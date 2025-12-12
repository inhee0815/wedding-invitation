import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Copy, Check } from 'lucide-react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Location: React.FC = () => {
  // 실제 지도 좌표 (가천컨벤션센터)
  const LAT = 37.448552;
  const LNG = 127.127027;

  const mapUrl = `https://map.kakao.com/link/map/가천컨벤션센터,${LAT},${LNG}`;
  const address = "경기 성남시 수정구 성남대로 1342 (태평동 650)";

  const [copied, setCopied] = useState(false);

  const mapContainerRef = useRef(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Kakao Map 로딩 로직
  useEffect(() => {
    // 1. Kakao Maps SDK가 로드되었는지 확인하고, ref가 존재하는지 확인
    if (window.kakao && window.kakao.maps && mapContainerRef.current) {
      window.kakao.maps.load(() => {
        const mapContainer = mapContainerRef.current; // 지도를 표시할 div

        const mapOption = {
          center: new window.kakao.maps.LatLng(LAT, LNG), // 지도의 중심좌표
          level: 3 // 지도의 확대 레벨
        };

        // 2. 지도를 생성합니다
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 3. 마커를 생성하고 지도에 표시합니다
        const markerPosition = new window.kakao.maps.LatLng(LAT, LNG);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      });

    } else {
      // SDK가 로드되지 않았거나 mapContainerRef가 없을 경우
      // (주로 index.html에 스크립트가 로드되지 않았을 때 발생)
      console.warn('Kakao Maps SDK가 로드되지 않았거나 지도 컨테이너를 찾을 수 없습니다.');
    }
  }, [LAT, LNG]); // 좌표가 변경될 때 지도를 다시 로드

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
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%' }} // 부모 aspect-video에 맞추기 위해 100% 설정
        >
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-wood-900 text-sm font-bold hover:bg-white transition-colors pointer-events-auto"
          >
            <MapPin size={16} /> 지도 보기
          </a>
        </div>
      </div>

      <div className="space-y-4 text-sm text-stone-600 max-w-md mx-auto bg-paper p-6 rounded-lg">
        <div>
          <strong className="text-wood-800 block mb-1">🚇 지하철</strong>
          <p className="text-xs">수인분당선 <span className="font-bold text-yellow-600">가천대역</span> 1번 출구<br />(비전타워 통로 연결)</p>
        </div>
        <div>
          <strong className="text-wood-800 block mb-1">🚌 버스</strong>
          <p className="text-xs">가천대역.가천대학교 하차<br />간선 302, 303, 333, 440 등</p>
        </div>
        <div>
          <strong className="text-wood-800 block mb-1">🚗 자가용 / 주차</strong>
          <p className="text-xs">네비게이션 '가천컨벤션센터' 또는 '가천대학교 비전타워'<br />비전타워 주차장 B3~B4층 이용</p>
        </div>
      </div>
    </section>
  );
};

export default Location;
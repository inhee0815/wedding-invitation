import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Copy, Check } from 'lucide-react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Location: React.FC = () => {
  // Constants for Navigation
  const NAV_INFO = {
    name: "가천컨벤션센터",
    lat: 37.4497253,
    lng: 127.127107,
  };

  const mapUrl = `https://map.kakao.com/link/to/가천컨벤션센터,${NAV_INFO.lat},${NAV_INFO.lng}`;
  const address = "경기 성남시 수정구 성남대로 1342 (태평동 650)";

  const [copied, setCopied] = useState(false);

  const mapContainerRef = useRef(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigation = (e: React.MouseEvent, type: 'naverMap' | 'tmap' | 'kakaoMap') => {
    e.preventDefault();

    const msg = '앱이 설치되어 있지 않은 경우\n길 안내가 실행되지 않을 수 있습니다.';
    alert(msg);

    const { name, lat, lng } = NAV_INFO;

    switch (type) {
      case 'kakaoMap':
        window.location.href = mapUrl;
        break;

      case 'tmap':
        window.location.href = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${name}`;
        break;

      case 'naverMap':
        const appUrl = `navermaps://?menu=location&pinType=place&lat=${lat}&lng=${lng}&title=${name}`;
        // Fallback Web URL (using modern Naver Map web parameters)
        const webUrl = `http://map.naver.com/index.nhn?elng=${lng}&elat=${lat}&etext=${name}&menu=route&pathType=0`;

        // Timer hack to check if app opened
        const clickedAt = +new Date();

        // Attempt to open app
        window.location.href = appUrl;

        // Fallback check
        setTimeout(() => {
          if (+new Date() - clickedAt < 2000) {
            // If the user is still on this page after 1.5s (meaning app didn't switch context), open web
            window.location.href = webUrl;
          }
        }, 1500);
        break;
    }
  };
  // Kakao Map 로딩 로직
  useEffect(() => {
    // 1. Kakao Maps SDK가 로드되었는지 확인하고, ref가 존재하는지 확인
    if (window.kakao && window.kakao.maps && mapContainerRef.current) {
      window.kakao.maps.load(() => {
        const mapContainer = mapContainerRef.current; // 지도를 표시할 div

        const mapOption = {
          center: new window.kakao.maps.LatLng(NAV_INFO.lat, NAV_INFO.lng), // 지도의 중심좌표
          level: 3 // 지도의 확대 레벨
        };

        // 2. 지도를 생성합니다
        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        // 3. 마커를 생성하고 지도에 표시합니다
        const markerPosition = new window.kakao.maps.LatLng(NAV_INFO.lat, NAV_INFO.lng);
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
  }, [NAV_INFO.lat, NAV_INFO.lng]); // 좌표가 변경될 때 지도를 다시 로드

  return (
    <>
      <section className="py-16 px-6 bg-paper">
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
              className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors z-10"
            >
              <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-sm flex items-center gap-2 text-sm text-wedding-accent font-medium">
                <MapPin size={16} /> 카카오맵으로 보기
              </div>
            </a>
          </div>
        </div>
        {/* Navigation Links Section */}
        <div className="max-w-md mx-auto mb-4 text-sm bg-white p-6 rounded-lg shadow-sm border border-stone-100">
          <strong className="text-wood-800 block mb-2">📍 내비게이션</strong>
          <p className="text-xs text-stone-500 mb-4">원하시는 앱을 선택하시면 길안내가 시작됩니다.</p>

          <div className="grid grid-cols-3 gap-3">
            {/* Naver Map */}
            <button
              onClick={(e) => handleNavigation(e, 'naverMap')}
              className="flex flex-col items-center justify-center bg-stone-50 border border-stone-100 rounded-lg py-3 hover:bg-stone-100 transition-colors gap-1.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-[#03C75A] flex items-center justify-center text-white font-bold shadow-sm">
                <span className="text-[10px] transform scale-150">N</span>
              </div>
              <span className="text-[11px] text-stone-700 font-medium mt-1">네이버지도</span>
            </button>

            {/* TMap */}
            <button
              onClick={(e) => handleNavigation(e, 'tmap')}
              className="flex flex-col items-center justify-center bg-stone-50 border border-stone-100 rounded-lg py-3 hover:bg-stone-100 transition-colors gap-1.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00C73C] to-[#004C8C] flex items-center justify-center text-white font-bold shadow-sm">
                <span className="text-[10px] transform scale-125">T</span>
              </div>
              <span className="text-[11px] text-stone-700 font-medium mt-1">티맵</span>
            </button>

            {/* KakaoNavi */}
            <button
              onClick={(e) => handleNavigation(e, 'kakaoMap')}
              className="flex flex-col items-center justify-center bg-stone-50 border border-stone-100 rounded-lg py-3 hover:bg-stone-100 transition-colors gap-1.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center text-[#191919] relative overflow-hidden shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-y-[1px]">
                  <path d="M12 3L4 19L12 15L20 19L12 3Z" />
                </svg>
              </div>
              <span className="text-[11px] text-stone-700 font-medium mt-1">카카오맵</span>
            </button>
          </div>
        </div>

        <div className="space-y-6 text-sm text-stone-600 max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-stone-100">
          <div>
            <strong className="text-wood-800 block mb-2">🚇 지하철</strong>
            <p className="text-xs leading-relaxed text-stone-500">수인분당선 <span className="font-bold text-[#EBA900]">가천대역</span> 1번 출구<br />(비전타워 통로 연결)</p>
          </div>
          <div className="border-t border-stone-100 pt-4">
            <strong className="text-wood-800 block mb-2">🚌 버스</strong>
            <p className="text-xs leading-relaxed text-stone-500">
              가천대역.가천대학교 하차<br />
              <span className="inline-block mt-1 text-[10px] text-stone-400">간선 302, 303, 333, 440 등</span>
            </p>
          </div>
          <div className="border-t border-stone-100 pt-4">
            <strong className="text-wood-800 block mb-2">🚗 자가용 / 주차</strong>
            <p className="text-xs leading-relaxed text-stone-500">
              내비게이션 '가천컨벤션센터' 또는 '가천대학교 비전타워'<br />
              <span className="inline-block mt-1 text-wood-800 font-medium">비전타워 주차장 B3~B4층 이용</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Location;
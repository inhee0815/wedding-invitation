import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Bus, Train, Car, Copy, Check } from 'lucide-react';

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
  const [isMapLoaded, setIsMapLoaded] = useState(false);


  const mapContainerRef = useRef(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNavigation = (e: React.MouseEvent, type: string) => {
    e.preventDefault();

    const { name, lat, lng } = NAV_INFO;

    switch (type) {
      case 'kakaoMap':
        window.location.href = mapUrl;
        break;

      case 'tmap':
        window.location.href = `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${name}`;
        break;

      case 'naverMap':
        const webUrl = `http://map.naver.com/index.nhn?elng=${lng}&elat=${lat}&etext=${name}&menu=route&pathType=0`;

        window.location.href = webUrl;
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
        setIsMapLoaded(true);
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
          />
          {/* Fallback Overlay: Only rendered if map is NOT loaded */}
          {!isMapLoaded && (
            <div className="absolute inset-0">
              <img
                src="https://picsum.photos/800/400?blur=2"
                className="w-full h-full object-cover opacity-50 absolute inset-0"
                alt="Map Preview"
              />
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors z-10"
              >
                <div className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-sm flex items-center gap-2 text-sm text-wood-900 font-medium">
                  <MapPin size={16} /> 카카오맵으로 보기
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Navigation Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'naverMap', name: '네이버', color: '#03C75A', icon: 'N' },
              { id: 'tmap', name: '티맵', color: '#111111', icon: 'T' },
              { id: 'kakaoMap', name: '카카오', color: '#FEE500', icon: 'K' }
            ].map((app) => (
              <button
                key={app.id}
                onClick={(e: any) => { handleNavigation(e, app.id) }}
                className="flex flex-col items-center py-4 bg-white rounded-xl border border-stone-100 shadow-sm transition-all active:scale-95 hover:bg-stone-50"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm text-sm font-bold"
                  style={{ backgroundColor: app.color, color: 'white' }}
                >
                  {app.icon}
                </div>
                <span className="text-[11px] text-stone-600 font-medium">{app.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transport Info Section */}
        <div className="space-y-4">
          {/* Subway */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg"><Train size={18} className="text-wood-700" /></div>
              <div>
                <h4 className="text-[14px] font-bold text-wood-900 mb-2">지하철 이용 시</h4>
                <div className="text-[13px] leading-relaxed text-stone-500">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-[#EBA900] text-white text-[10px] mr-1">수인분당선</span>
                  <span className="font-bold text-stone-700">가천대역</span> 1번 출구
                  <p className="mt-1 text-stone-400">비전타워 통로를 통해 예식장까지 연결됩니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2"><Bus size={18} className="text-wood-700" /></div>
              <div>
                <h4 className="text-[14px] font-bold text-wood-900 mb-2">버스 이용 시</h4>
                <p className="text-[13px] leading-relaxed text-stone-500 font-bold text-stone-700">가천대역.가천대학교 하차</p>
                <p className="mt-1 text-[12px] text-stone-400">간선 302, 303, 333, 440, 452</p>
                <p className="text-[12px] text-stone-400">일반 116, 119, 15-1, 32, 5, 500-1</p>
              </div>
            </div>
          </div>

          {/* Parking */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2"><Car size={18} className="text-wood-700" /></div>
              <div>
                <h4 className="text-[14px] font-bold text-wood-900 mb-2">자가용 및 주차</h4>
                <p className="text-[13px] leading-relaxed text-stone-500">
                  <span className="text-wood-800 font-bold">비전타워 주차장 B3 ~ B4층</span> 이용
                </p>
                <p className="mt-1 text-[12px] text-stone-400">내비게이션에 '가천컨벤션센터' 검색</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Location;
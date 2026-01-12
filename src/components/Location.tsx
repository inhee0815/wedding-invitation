import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Bus, Train, Car, Copy, Check } from 'lucide-react';
import { CallWeb2App } from '../utils/callweb2app';

declare global {
  interface Window {
    kakao: any;
  }
}

const Location: React.FC = () => {
  // Constants for Navigation
  const NAV_INFO = {
    name: "가천컨벤션센터",
    encodedName: encodeURIComponent("가천컨벤션센터"),
    lat: 37.4497253,
    lng: 127.127107,
  };

  const mapUrl = `https://map.kakao.com/link/to/${NAV_INFO.name},${NAV_INFO.lat},${NAV_INFO.lng}`;
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

    const { name, encodedName, lat, lng } = NAV_INFO;
    var options: any = {};

    const msg = '앱이 설치되어 있지 않은 경우\n길 안내가 실행되지 않을 수 있습니다.';
    alert(msg);

    switch (type) {
      case 'kakaoNavi':
        options = {
          scheme: `kakaonavi://destination?x=${lng}&y=${lat}&name=${encodedName}`,
          package: 'com.locnall.KimGiSa',
          fallbackUrl: `https://map.kakao.com/link/to/${name},${lat},${lng}`
        };
        break;
      case 'tmap':
        options = {
          scheme: `tmap://route?goalx=${lng}&goaly=${lat}&goalname=${encodedName}`,
          package: 'com.skt.tmap.ku',
          fallbackUrl: ''
        };
        break;
      case 'naverMap':
        options = {
          scheme: `navermaps://?menu=location&pinType=place&lat=${lat}&lng=${lng}&title=${encodedName}`,
          package: 'com.nhn.android.nmap',
          fallbackUrl: `http://map.naver.com/index.nhn?elng=${lng}&elat=${lat}&etext=${name}&menu=route&pathType=0`
        };
        break;
    }

    const callWeb2App = new CallWeb2App(options);
    callWeb2App.run();

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
          <span className="text-wood-800 text-sm tracking-widest font-cinzel font-medium border-b border-wood-300 pb-1">LOCATION</span>
          <h3 className="mt-6 text-xl font-gothic font-bold text-wood-900">가천컨벤션센터 컨벤션홀, 5층</h3>
          <p className="mt-2 text-stone-600 text-sm font-gothic">{address}</p>
          <button
            onClick={handleCopyAddress}
            className="mt-3 text-xs text-stone-500 border border-stone-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1 hover:bg-stone-50"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            {copied ? "완료" : "주소 복사"}
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
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={(e) => handleNavigation(e, 'naverMap')}
              className="flex items-center justify-center gap-1.5 bg-white border border-stone-100 rounded-md py-4 px-1 hover:bg-stone-100 transition-colors shadow-sm active:scale-95"
            >
              <img src="images/navi/ico_nav01.png" alt="Naver" className="w-5 h-5 object-contain rounded-sm" onError={(e) => {
                (e.target as any).style.display = 'none';
                (e.target as any).nextSibling.style.display = 'flex';
              }} />
              {/* Fallback Icon if image fails */}
              <div className="hidden w-5 h-5 rounded-sm bg-[#03C75A] items-center justify-center text-white font-bold text-[8px]">N</div>
              <span className="text-[12px] text-stone-700 font-medium truncate">네이버맵</span>
            </button>

            <button
              onClick={(e) => handleNavigation(e, 'tmap')}
              className="flex items-center justify-center gap-1.5 bg-white border border-stone-100 rounded-md py-2 px-1 hover:bg-stone-100 transition-colors shadow-sm active:scale-95"
            >
              <img src="images/navi/ico_nav02.png" alt="Tmap" className="w-5 h-5 object-contain rounded-sm" onError={(e) => {
                (e.target as any).style.display = 'none';
                (e.target as any).nextSibling.style.display = 'flex';
              }} />
              {/* Fallback Icon */}
              <div className="hidden w-5 h-5 rounded-sm bg-[#004C8C] items-center justify-center text-white font-bold text-[8px]">T</div>
              <span className="text-[12px] text-stone-700 font-medium truncate">티맵</span>
            </button>

            <button
              onClick={(e) => handleNavigation(e, 'kakaoNavi')}
              className="flex items-center justify-center gap-1.5 bg-white border border-stone-100 rounded-md py-2 px-1 hover:bg-stone-100 transition-colors shadow-sm active:scale-95"
            >
              <img src="images/navi/ico_nav03.png" alt="Kakao" className="w-5 h-5 object-contain rounded-sm" onError={(e) => {
                (e.target as any).style.display = 'none';
                (e.target as any).nextSibling.style.display = 'flex';
              }} />
              {/* Fallback Icon */}
              <div className="hidden w-5 h-5 rounded-sm bg-[#FEE500] items-center justify-center text-[#191919] shadow-sm font-bold text-[8px]">K</div>
              <span className="text-[12px] text-stone-700 font-medium truncate">카카오내비</span>
            </button>
          </div>
        </div>

        {/* Transport Info Section */}
        <div className="space-y-4">
          {/* Subway */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 rounded-lg"><Train size={18} className="text-wood-700" /></div>
              <div>
                <h4 className="text-[14px] font-gothic font-bold text-wood-900 mb-2">지하철 이용 시</h4>
                <div className="text-[13px] leading-relaxed text-stone-500">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-[#EBA900] text-white text-[10px] mr-1">수인분당선</span>
                  <span className="font-gothic text-stone-700"><span className="font-bold">가천대역 1번</span> 출구</span>
                  <p className="font-gothic mt-1 text-[12px] text-stone-400">비전타워 통로를 통해 예식장까지 연결됩니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2"><Bus size={18} className="text-wood-700" /></div>
              <div>
                <h4 className="text-[14px] font-gothic font-bold text-wood-900 mb-2">버스 이용 시</h4>
                <p className="text-[13px] leading-relaxed text-stone-500 font-gothic font-bold text-stone-700">가천대역.가천대학교 하차</p>
                <p className="mt-1 text-[12px] text-stone-400 font-gothic">간선 302, 303, 333, 440, 452</p>
                <p className="text-[12px] text-stone-400 font-gothic">일반 116, 119, 15-1, 32, 5, 500-1</p>
              </div>
            </div>
          </div>

          {/* Parking */}
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2"><Car size={18} className="text-wood-700" /></div>
              <div>
                <h4 className="text-[14px] font-gothic font-bold text-wood-900 mb-2">자가용 및 주차</h4>
                <p className="text-[13px] leading-relaxed text-stone-500 font-gothic">
                  <span className="text-wood-800 font-gothic font-bold">비전타워 주차장 B3 ~ B4층</span> 이용
                </p>
                <p className="mt-1 text-[12px] text-stone-400 font-gothic">내비게이션에 '가천컨벤션센터' 검색</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Location;
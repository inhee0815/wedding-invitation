import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import HeroEnvelope from './components/HeroEnvelope';
import InvitationText from './components/InvitationText';
import Gallery from './components/Gallery';
import Countdown from './components/Countdown';
import Location from './components/Location';
import Contact from './components/Contact';
import Guestbook from './components/Guestbook';
import LikeSection from './components/LikeSection';
import Share from './components/Share';

// Global types for window (Kakao)
declare global {
  interface Window {
    Kakao: any;
  }
}

const App: React.FC = () => {
  // We can track if the envelope is fully opened to enable scrolling to other sections easier,
  // but the current implementation relies on the Hero height naturally allowing scroll.
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current = new Audio("/wedding-invitation/bgm/main.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <main className="max-w-[480px] mx-auto min-h-screen bg-white shadow-2xl font-sans text-stone-800 relative">

      {/* Global Fixed Music Toggle Button */}
      {/* Positioned relative to the main container, but fixed on screen within constraints if possible, 
          or standard fixed to viewport. Since max-width is 480px, fixed right-6 might put it outside on desktop. 
          For mobile view, fixed is fine. */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={togglePlay}
          className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md text-stone-600 hover:bg-white transition-all transform hover:scale-105"
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>


      {/* 1. Hero / Envelope Section */}
      <HeroEnvelope onOpened={() => setIsEnvelopeOpen(true)} />

      {/* 2. Invitation Text */}
      <InvitationText />

      {/* 3. Countdown */}
      <Countdown targetDate="2026-04-26T13:50:00" />

      {/* 4. Gallery */}
      <Gallery />

      {/* 5. Location / Map */}
      <Location />

      {/* 6. Contact Info */}
      <Contact />

      {/* 7. Like / Heart */}
      <LikeSection />

      {/* 8. Guestbook */}
      <Guestbook />

      {/* 9. Share & Footer */}
      <Share />

      {/* Audio Player could go here as a sticky floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Placeholder for music button */}
      </div>

    </main>
  );
};

export default App;
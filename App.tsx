import React, { useState } from 'react';
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

  return (
    <main className="max-w-[480px] mx-auto min-h-screen bg-white shadow-2xl overflow-hidden font-sans text-stone-800">
      
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
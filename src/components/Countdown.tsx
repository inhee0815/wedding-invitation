import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [dDay, setDDay] = useState('');

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setDDay('D-DAY');
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        setDDay(`D-${days}`);

        setTimeLeft({
          days,
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="py-20 bg-paper text-center">
      <h4 className="font-serif text-3xl text-wood-900 mb-6 font-bold">{dDay}</h4>
      <div className="text-stone-500 mb-10 text-sm">
        2026. 04. 26. SUN 13:50 PM
      </div>

      <div className="flex justify-center gap-4 text-wood-800">
        <TimeUnit value={timeLeft.days} label="DAYS" />
        <div className="text-2xl pt-2">:</div>
        <TimeUnit value={timeLeft.hours} label="HOUR" />
        <div className="text-2xl pt-2">:</div>
        <TimeUnit value={timeLeft.minutes} label="MIN" />
        <div className="text-2xl pt-2">:</div>
        <TimeUnit value={timeLeft.seconds} label="SEC" />
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center w-16">
    <div className="text-3xl font-light font-serif tabular-nums tracking-widest">
      {value.toString().padStart(2, '0')}
    </div>
    <div className="text-[10px] tracking-widest mt-2 opacity-60">{label}</div>
  </div>
);

export default Countdown;

import React, { useEffect, useState } from 'react';

interface SplashProps {
  onFinish: () => void;
}

const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  const [isEntering, setIsEntering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start entry animation
    requestAnimationFrame(() => setIsEntering(true));
    
    // Total display time 2.2s. Start exit at 1.8s.
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#F4F6F4] overflow-hidden select-none transition-opacity duration-500 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background stays solid to prevent flicker */}
      <div className="absolute inset-0 bg-[#F4F6F4]"></div>
      
      {/* Center Content */}
      <div className={`relative flex flex-col items-center transition-all duration-[800ms] ease-out transform ${isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.9]'}`}>
        <div className="w-24 h-24 bg-[#4BA678] rounded-[32px] flex items-center justify-center shadow-lg mb-8">
          <i className="fa-solid fa-route text-4xl text-white"></i>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#2D2D2D]">TriYatri</h1>
          <p className="text-[14px] font-medium text-[#2D2D2D]/50">North Tripura Local Mobility</p>
        </div>
      </div>

      {/* Fixed bottom footer */}
      <div className={`absolute bottom-12 transition-opacity duration-700 delay-300 ${isEntering ? 'opacity-30' : 'opacity-0'}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#2D2D2D]">
          Made with ❤️ in Dharmanagar
        </p>
      </div>
    </div>
  );
};

export default Splash;

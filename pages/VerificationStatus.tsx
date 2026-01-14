
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface VerificationStatusProps {
  isDarkMode: boolean;
  user: User | null;
  onContinue: () => void;
}

type RiderStatus = 'PENDING' | 'APPROVED' | 'FAILED' | 'SUSPENDED';

const VerificationStatus: React.FC<VerificationStatusProps> = ({ isDarkMode, user, onContinue }) => {
  const [status, setStatus] = useState<RiderStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('PENDING');
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  if (loading) {
    return (
      <div className={`min-h-full flex flex-col items-center justify-center p-8 transition-colors duration-700 ${bgColor}`}>
        <div className="w-10 h-10 border-4 border-[#4BA678]/20 border-t-[#4BA678] rounded-full animate-spin mb-4"></div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${secondaryText}`}>Verifying Identity...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-full flex flex-col transition-colors duration-700 ${bgColor}`}>
      <div className={`p-6 pt-12 flex items-center justify-center border-b ${dividerColor} ${cardBg}`}>
        <h1 className={`text-sm font-black uppercase tracking-[0.3em] ${primaryText}`}>Compliance Center</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className={`w-full max-w-sm p-8 rounded-[40px] border ${dividerColor} ${cardBg} shadow-sm text-center space-y-8 animate-in fade-in zoom-in-95 duration-700`}>
          
          <div className="w-20 h-20 bg-amber-500/10 rounded-full mx-auto flex items-center justify-center text-amber-500">
            <i className="fa-solid fa-hourglass-half text-3xl"></i>
          </div>
          
          <div className="space-y-2">
            <h2 className={`text-xl font-bold tracking-tight ${primaryText}`}>Documents Pending</h2>
            <p className={`text-sm leading-relaxed ${secondaryText}`}>
              Hi {user?.name?.split(' ')[0]}, we are verifying your Aadhaar and RC. This usually takes 24 hours.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={onContinue}
              className="w-full py-5 bg-[#4BA678] text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#4BA678]/20 active:scale-[0.98] transition-all"
            >
              Skip for Now (Dev Mode)
            </button>
            <p className={`text-[9px] font-black uppercase tracking-widest opacity-20 ${primaryText}`}>Official verification required for live duty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;

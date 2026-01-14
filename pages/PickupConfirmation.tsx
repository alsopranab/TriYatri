
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, VehicleType } from '../types';
import MapOverlay from '../components/MapOverlay';

interface PickupConfirmationProps {
  isDarkMode: boolean;
  user: User | null;
  activeRide: any;
  onStartRide: () => void;
}

const PickupConfirmation: React.FC<PickupConfirmationProps> = ({ isDarkMode, user, activeRide, onStartRide }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [checks, setChecks] = useState({
    present: true, // Default to true as they are at the pickup point
    countMatches: true,
    helmetOk: activeRide?.vehicleType !== VehicleType.BIKE
  });

  const capacityLimit = user?.role === UserRole.RIDER ? 1 : (user?.role === UserRole.ADMIN ? 6 : 4);
  const isOverCapacity = activeRide?.passengerCount > (activeRide?.vehicleType === VehicleType.BIKE ? 1 : 4);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    
    // Focus next input
    if (cleanValue && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-verify if all digits filled
    const completeOtp = newOtp.join('');
    if (completeOtp.length === 4) {
      // Simulation: Correct OTP for demo is 4829
      if (completeOtp === "4829") {
        setIsOtpVerified(true);
      } else {
        setIsOtpVerified(false);
      }
    } else {
      setIsOtpVerified(false);
    }
  };

  // The button should be enabled if OTP is verified and standard safety checks are toggled
  const allChecksPassed = isOtpVerified && checks.present && checks.countMatches && !isOverCapacity;

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]/95' : 'bg-white/95';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden transition-all duration-500 ${bgColor}`}>
      <div className="absolute inset-0 z-0 h-full">
        <MapOverlay center={{ lat: 24.3735, lng: 92.1624 }} isEmergency={activeRide?.isEmergency} />
        <div className="absolute inset-0 bg-black/5 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]"></div>
      </div>

      <div className="absolute top-14 left-0 right-0 z-50 p-6 flex flex-col items-center">
        <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-black/5 shadow-xl">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D2D2D]">Verify Passenger OTP</p>
        </div>
      </div>

      <div className="mt-auto relative z-30 p-4 space-y-4 pb-24">
        <div className={`w-full max-w-sm mx-auto rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/10 ${cardBg} p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom-10`}>
          <div className="flex justify-between items-center pb-4 border-b border-black/5">
            <div className="space-y-1">
              <p className={`text-[9px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Passenger</p>
              <h3 className={`text-base font-black ${primaryText}`}>Rahul Roy</h3>
            </div>
            <div className="text-right">
               <p className={`text-xl font-black ${isOverCapacity ? 'text-red-500' : primaryText}`}>{activeRide?.passengerCount || 1}</p>
               <p className={`text-[8px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Persons</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
               <p className={`text-[9px] font-black uppercase tracking-widest ${isOtpVerified ? 'text-[#4BA678]' : 'opacity-40 ' + primaryText}`}>
                 {isOtpVerified ? 'OTP VERIFIED' : 'Ask Passenger for OTP (4829)'}
               </p>
               {!isOtpVerified && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>}
            </div>
            
            <div className="flex justify-between gap-2 sm:gap-4 px-1">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-input-${i}`}
                  type="tel"
                  maxLength={1}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className={`w-full aspect-square max-w-[64px] rounded-2xl border text-center text-xl font-black focus:outline-none transition-all shadow-sm ${
                    isOtpVerified 
                      ? 'border-[#4BA678] bg-[#4BA678]/5 text-[#4BA678]' 
                      : `border-black/10 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} ${primaryText} focus:border-[#4BA678]`
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 px-1 ${primaryText}`}>Safety Compliance</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setChecks(p => ({...p, present: !p.present}))} 
                className={`p-4 rounded-2xl border flex flex-col gap-2 text-left transition-all ${checks.present ? 'bg-[#4BA678]/10 border-[#4BA678]' : 'border-black/5'}`}
              >
                <i className={`fa-solid fa-circle-check text-xs ${checks.present ? 'text-[#4BA678]' : 'opacity-20'}`}></i>
                <span className={`text-[9px] font-bold uppercase tracking-tight ${checks.present ? primaryText : 'opacity-30'}`}>Arrived</span>
              </button>
              <button 
                onClick={() => setChecks(p => ({...p, countMatches: !p.countMatches}))} 
                className={`p-4 rounded-2xl border flex flex-col gap-2 text-left transition-all ${checks.countMatches ? 'bg-[#4BA678]/10 border-[#4BA678]' : 'border-black/5'}`}>
                <i className={`fa-solid fa-users text-xs ${checks.countMatches ? 'text-[#4BA678]' : 'opacity-20'}`}></i>
                <span className={`text-[9px] font-bold uppercase tracking-tight ${checks.countMatches ? primaryText : 'opacity-30'}`}>Pax OK</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => {
              if (allChecksPassed) {
                onStartRide();
              }
            }}
            disabled={!allChecksPassed}
            className={`w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-xl transition-all active:scale-95 disabled:opacity-20 ${allChecksPassed ? 'bg-[#4BA678]' : 'bg-slate-400'}`}
          >
            {isOtpVerified ? 'Start Trip' : 'Enter OTP to Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupConfirmation;

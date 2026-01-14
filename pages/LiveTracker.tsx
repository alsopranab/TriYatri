
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideRequest, RideStatus } from '../types';
import MapOverlay from '../components/MapOverlay';

interface LiveTrackerProps {
  ride: RideRequest | null;
  isDarkMode: boolean;
}

const LiveTracker: React.FC<LiveTrackerProps> = ({ ride, isDarkMode }) => {
  const navigate = useNavigate();
  const [riderPos, setRiderPos] = useState({ lat: 24.3780, lng: 92.1650 });
  const [eta, setEta] = useState(4);
  const [status, setStatus] = useState('Rider is on the way');
  const [sheetState, setSheetState] = useState<'standard' | 'collapsed'>('standard');
  const [rideOtp] = useState("4829"); 

  useEffect(() => {
    if (!ride) {
      navigate('/');
      return;
    }
    const moveInterval = setInterval(() => {
      setRiderPos(prev => ({ lat: prev.lat - 0.0001, lng: prev.lng - 0.00005 }));
      setEta(prev => Math.max(0, prev - (Math.random() > 0.7 ? 1 : 0)));
    }, 4000);
    return () => clearInterval(moveInterval);
  }, [ride, navigate]);

  useEffect(() => {
    if (eta === 0) setStatus('Rider has reached pickup');
    else if (eta <= 2) setStatus('Rider arriving soon');
  }, [eta]);

  if (!ride) return null;

  const cardBg = isDarkMode ? 'bg-[#1A1D29]/95' : 'bg-white/95';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]'}`}>
      <div className="absolute inset-0 z-0">
        <MapOverlay center={riderPos} destinationCoords={{ lat: 24.3735, lng: 92.1624 }} />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.1)]"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 p-6 pt-12 pointer-events-none">
        <div className={`pointer-events-auto backdrop-blur-3xl p-5 rounded-[28px] border border-white/20 shadow-xl ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-[#4BA678]/10 flex items-center justify-center text-[#4BA678]">
                  <i className="fa-solid fa-user text-xl"></i>
               </div>
               <div>
                  <h3 className={`text-sm font-bold ${primaryText}`}>Deepak Debnath</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#4BA678]">TR 05 B 2234</p>
               </div>
            </div>
            <div className="bg-[#4BA678] px-4 py-2 rounded-2xl text-center shadow-lg">
               <p className="text-[8px] font-black uppercase text-white/70">Pickup OTP</p>
               <p className="text-lg font-black text-white">{rideOtp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-auto relative z-30 rounded-t-[44px] shadow-2xl backdrop-blur-3xl border-t border-white/20 ${cardBg} ${sheetState === 'collapsed' ? 'h-[160px]' : 'h-[50vh]'}`}>
        <button onClick={() => setSheetState(sheetState === 'standard' ? 'collapsed' : 'standard')} className="w-full py-4 flex flex-col items-center">
          <div className="w-12 h-1.5 bg-slate-400/30 rounded-full"></div>
        </button>

        <div className={`px-6 space-y-6 pb-32 transition-opacity duration-300 ${sheetState === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center justify-between">
             <div className="space-y-1">
                <h2 className={`text-xl font-bold ${primaryText}`}>{status}</h2>
                <p className="text-xs font-semibold text-slate-500">Arrival in <span className="text-[#4BA678]">{eta} min</span></p>
             </div>
             <span className="px-3 py-1 bg-[#4BA678]/10 text-[#4BA678] rounded-full text-[8px] font-black uppercase tracking-widest">GPS Tracked</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => navigate('/messages', { state: { openChatId: '1' } })} className="py-4 rounded-[28px] bg-slate-100 dark:bg-white/5 flex items-center justify-center gap-3 font-bold text-[11px] uppercase tracking-widest">
                <i className="fa-solid fa-message opacity-40"></i> Message
             </button>
             <button onClick={() => window.location.href = `tel:+919876543210`} className="py-4 bg-[#4BA678] text-white rounded-[28px] flex items-center justify-center gap-3 font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-[#4BA678]/20">
                <i className="fa-solid fa-phone"></i> Call Rider
             </button>
          </div>

          <div className="p-4 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
             <i className="fa-solid fa-shield-halved text-amber-500 text-sm"></i>
             <p className="text-[10px] font-medium leading-relaxed opacity-60">
               Share the OTP <span className="font-bold text-amber-600">{rideOtp}</span> only after checking the vehicle number.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracker;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleType, User, UserRole } from '../types';

interface RiderHomeProps {
  isDarkMode: boolean;
  user: User | null;
  onAccept?: (req: IncomingRequest) => void;
}

export interface IncomingRequest {
  id: string;
  pickup: string;
  drop: string;
  distanceToPickup: string;
  tripDistance: string;
  passengerCount: number;
  vehicleType: VehicleType;
  fare: number;
  isScheduled: boolean;
}

const RiderHome: React.FC<RiderHomeProps> = ({ isDarkMode, user, onAccept }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [isHeadingHome, setIsHeadingHome] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [showCancelWarning, setShowCancelWarning] = useState<{show: boolean, reqId: string | null}>({show: false, reqId: null});
  const [hasHomeAddress] = useState(true); 

  useEffect(() => {
    let requestTimer: number;
    if (isOnline) {
      // Simulate ride generation
      requestTimer = window.setTimeout(() => {
        const newReq: IncomingRequest = {
          id: 'REQ-' + Math.floor(Math.random() * 9000),
          pickup: 'Dharmanagar Railway Station',
          drop: isHeadingHome ? 'Baluar Ghat (Near Home)' : 'North Tripura District Hospital',
          distanceToPickup: '0.8 km',
          tripDistance: '4.2 km',
          passengerCount: 2,
          vehicleType: VehicleType.AUTO,
          fare: 120,
          isScheduled: false,
        };
        setIncomingRequests([newReq]);
      }, 5000);
    }
    return () => clearTimeout(requestTimer);
  }, [isOnline, isHeadingHome]);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (isOnline) {
      setIsHeadingHome(false);
      setIncomingRequests([]);
    }
  };

  const handleDeclineClick = (reqId: string) => {
    setShowCancelWarning({ show: true, reqId });
  };

  const confirmDecline = () => {
    setIncomingRequests([]);
    setShowCancelWarning({ show: false, reqId: null });
  };

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden transition-all duration-500 ${bgColor}`}>
      
      {/* 1. TOP BAR - High Contrast Toggle */}
      <div className={`absolute top-0 left-0 right-0 z-[60] p-6 pt-12 flex justify-between items-center border-b border-black/5 backdrop-blur-xl ${isDarkMode ? 'bg-[#1A1D29]/90' : 'bg-white/90'}`}>
        <div className="flex flex-col">
          <h2 className={`text-sm font-black uppercase tracking-widest ${primaryText}`}>{user?.name?.split(' ')[0]}</h2>
          <span className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>
            {user?.role === UserRole.RIDER ? 'Bike' : 'Auto'} • TR 05 B 2234
          </span>
        </div>

        <button 
          onClick={handleToggleOnline}
          className={`relative w-28 h-10 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner ${isOnline ? 'bg-[#4BA678]' : 'bg-slate-400 dark:bg-white/20'}`}
        >
          <span className={`absolute text-[9px] font-black uppercase tracking-widest text-white transition-all duration-300 ${isOnline ? 'left-4' : 'right-4'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <div className={`w-8 h-8 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${isOnline ? 'translate-x-[72px]' : 'translate-x-0'}`}></div>
        </button>
      </div>

      {/* 2. MAP & RADAR - Correct Z-Indexing */}
      <div className="absolute inset-0 z-0">
        <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-[#12141C]' : 'bg-[#E5E7EB]'}`}>
           <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '60px 60px'}}></div>
           <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white transition-colors duration-500 z-10 relative ${isOnline ? 'bg-[#4BA678]' : 'bg-slate-500'}`}>
              <i className="fa-solid fa-location-arrow text-white text-sm"></i>
            </div>
            {isOnline && <div className="absolute -inset-8 bg-[#4BA678]/20 rounded-full animate-ping z-0"></div>}
          </div>
        </div>
      </div>

      {/* 3. CENTER STATE INDICATOR - Adjusted position to avoid overlap */}
      <div className="absolute top-[45%] left-0 right-0 flex items-center justify-center pointer-events-none z-20">
        {!isOnline ? (
          <div className="px-6 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">You are offline</span>
          </div>
        ) : incomingRequests.length === 0 && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in duration-700">
             <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-[#1A1D29]/80 backdrop-blur-lg border border-white/10 shadow-2xl">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4BA678] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                  {isHeadingHome ? 'Searching home route...' : 'Waiting for rides...'}
                </span>
             </div>
          </div>
        )}
      </div>

      {/* 4. HEADING TOWARDS HOME - Choices explicit */}
      <div className={`absolute bottom-32 left-0 right-0 z-40 px-6 transition-all duration-500 ${isOnline ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className={`max-w-sm mx-auto p-5 rounded-[32px] border shadow-2xl transition-all duration-300 ${cardBg} ${isHeadingHome ? 'border-[#4BA678]' : 'border-black/5'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isHeadingHome ? 'bg-[#4BA678] text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                <i className="fa-solid fa-house-chimney text-sm"></i>
              </div>
              <div>
                <h4 className={`text-[11px] font-black uppercase tracking-tight ${primaryText}`}>Heading Home?</h4>
                <p className={`text-[9px] font-bold uppercase tracking-tighter ${isHeadingHome ? 'text-[#4BA678]' : 'opacity-40'}`}>
                  {isHeadingHome ? 'Filtering for home route' : 'Available for all rides'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsHeadingHome(!isHeadingHome)}
              disabled={!hasHomeAddress}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 shadow-inner ${isHeadingHome ? 'bg-[#4BA678]' : 'bg-slate-200 dark:bg-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${isHeadingHome ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* 5. FLOATING ACTIONS */}
      <div className="absolute right-6 bottom-56 z-50 flex flex-col gap-3">
        <button className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 ${cardBg} ${primaryText} active:scale-90 transition-all`}>
           <i className="fa-solid fa-crosshairs text-sm opacity-60"></i>
        </button>
        <button className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl bg-red-500 text-white active:scale-90 transition-all`}>
           <i className="fa-solid fa-shield-heart text-sm"></i>
        </button>
      </div>

      {/* 6. INCOMING REQUEST CARD */}
      {isOnline && incomingRequests.length > 0 && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-sm mx-auto rounded-[44px] shadow-2xl border border-white/10 ${cardBg} p-8 space-y-6 mb-24 animate-in slide-in-from-bottom-full duration-500`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-[#4BA678]/10 text-[#4BA678] rounded-lg text-[9px] font-black uppercase tracking-widest">
                  {isHeadingHome ? 'Direct Route' : 'New Request'}
                </span>
                <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${primaryText}`}>0.8 km away</p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-black ${primaryText}`}>₹{incomingRequests[0].fare}</p>
                <p className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Net Earnings</p>
              </div>
            </div>

            <div className="space-y-4 py-4 border-y border-black/5">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full border-2 border-[#4BA678] mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Pickup</p>
                  <p className={`text-sm font-bold leading-tight ${primaryText}`}>{incomingRequests[0].pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-[#4BA678] mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Drop</p>
                  <p className={`text-sm font-bold leading-tight ${primaryText}`}>{incomingRequests[0].drop}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => handleDeclineClick(incomingRequests[0].id)} 
                className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} active:scale-95 transition-all`}
              >
                Decline
              </button>
              <button 
                onClick={() => onAccept?.(incomingRequests[0])}
                className="flex-[2] py-4 rounded-2xl bg-[#4BA678] text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CANCELLATION WARNING MODAL */}
      {showCancelWarning.show && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-8 animate-in zoom-in-95 duration-300">
           <div className={`w-full max-w-xs p-8 rounded-[40px] ${cardBg} border border-red-500/20 text-center space-y-6 shadow-2xl`}>
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                 <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              </div>
              <div className="space-y-2">
                 <h4 className={`text-lg font-black ${primaryText}`}>Wait, Rider!</h4>
                 <p className="text-[11px] leading-relaxed opacity-60">
                   Declining or cancelling rides without valid reason affects your score.
                   <br/><br/>
                   <span className="text-red-500 font-bold uppercase tracking-widest">Warning:</span> Excessive cancellations can result in a <span className="text-red-500 font-bold">3-hour ban</span> from receiving new rides.
                 </p>
              </div>
              <div className="grid gap-3">
                 <button onClick={confirmDecline} className="w-full py-4 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest">Decline Anyway</button>
                 <button onClick={() => setShowCancelWarning({show: false, reqId: null})} className={`w-full py-4 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} rounded-full font-black text-[10px] uppercase tracking-widest`}>Back to Ride</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RiderHome;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleType, User, RideRequest } from '../types';
import MapOverlay from '../components/MapOverlay';

interface RiderNavigationProps {
  isDarkMode: boolean;
  user: User | null;
  activeRide: any;
  onReachedPickup: () => void;
}

const RiderNavigation: React.FC<RiderNavigationProps> = ({ isDarkMode, user, activeRide, onReachedPickup }) => {
  const navigate = useNavigate();
  const [etaToPickup, setEtaToPickup] = useState(3);
  const [isNearPickup, setIsNearPickup] = useState(false);
  const [status, setStatus] = useState<'EN_ROUTE' | 'REACHED'>('EN_ROUTE');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const passengerPhone = "+910000000000";

  useEffect(() => {
    const timer = setTimeout(() => {
      setEtaToPickup(1);
      setIsNearPickup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleReached = () => {
    if (!isNearPickup) return;
    setStatus('REACHED');
  };

  const handleCall = () => {
    window.location.href = `tel:${passengerPhone}`;
  };

  const handleMessage = () => {
    navigate('/messages', { state: { openChatId: '1', riderName: 'Rahul Roy (Passenger)' } });
  };

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden transition-all duration-500 ${bgColor}`}>
      <div className={`absolute top-0 left-0 right-0 z-50 p-6 pt-12 flex flex-col items-center border-b border-black/5 backdrop-blur-md ${isDarkMode ? 'bg-[#1A1D29]/80' : 'bg-white/80'}`}>
        <h1 className={`text-xs font-black uppercase tracking-[0.3em] ${primaryText}`}>Ride Accepted</h1>
        <p className={`text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1 ${primaryText}`}>Navigate to pickup location</p>
      </div>

      <div className="absolute inset-0 z-0">
        <MapOverlay 
          center={{ lat: 24.3780, lng: 92.1650 }} 
          destinationCoords={{ lat: 24.3735, lng: 92.1624 }} 
          isEmergency={activeRide?.isEmergency}
        />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-[#2D2D2D] text-white px-5 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4BA678] animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{etaToPickup} MIN TO PICKUP</span>
          </div>
        </div>
      </div>

      <div className="mt-auto relative z-30 space-y-3 p-6">
        <div className={`w-full rounded-[40px] shadow-2xl border border-white/10 ${cardBg} p-8 space-y-6`}>
          <div className="flex justify-between items-start">
            <div className="space-y-1 flex-1">
              <p className={`text-[9px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Pickup Point</p>
              <h3 className={`text-sm font-black leading-tight truncate ${primaryText}`}>{activeRide?.pickup || 'Dharmanagar Station'}</h3>
            </div>
            <div className="text-right pl-4">
               <p className={`text-lg font-black ${primaryText}`}>{activeRide?.passengerCount || 1}</p>
               <p className={`text-[8px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Persons</p>
            </div>
          </div>

          <div className="flex items-center gap-4 py-4 border-y border-black/5">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
               <i className="fa-solid fa-user text-xl opacity-20"></i>
            </div>
            <div>
               <p className={`text-sm font-black ${primaryText}`}>Rahul Roy</p>
               <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase tracking-widest">Verified User</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={handleMessage} className={`py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest border ${isDarkMode ? 'border-white/10 text-white/60' : 'border-black/5 text-slate-600'} active:bg-black/5`}>
                <i className="fa-solid fa-message text-xs"></i>
                Message
             </button>
             <button onClick={handleCall} className={`py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest border ${isDarkMode ? 'border-white/10 text-white/60' : 'border-black/5 text-slate-600'} active:bg-black/5`}>
                <i className="fa-solid fa-phone text-xs"></i>
                Call
             </button>
          </div>

          {status === 'EN_ROUTE' ? (
            <button onClick={handleReached} disabled={!isNearPickup} className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-xl transition-all active:scale-95 disabled:opacity-20 bg-[#2D2D2D]">
              Reached Pickup
            </button>
          ) : (
            <button onClick={() => onReachedPickup()} className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-xl transition-all active:scale-95 bg-[#4BA678]">
              Start Trip
            </button>
          )}

          <div className="flex justify-between items-center pt-2">
             <button onClick={() => setShowCancelConfirm(true)} className={`text-[9px] font-black uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity ${primaryText}`}>
               Cancel Ride
             </button>
             <button className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-90">
                <i className="fa-solid fa-shield-heart text-xs"></i>
             </button>
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
           <div className={`w-full max-w-xs p-8 rounded-[40px] ${cardBg} border border-white/10 text-center space-y-6 shadow-2xl`}>
              <div className="space-y-2">
                 <h4 className="text-lg font-bold">Cancel this ride?</h4>
              </div>
              <div className="grid gap-3">
                 <button onClick={() => navigate('/')} className="w-full py-4 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest">Confirm Cancellation</button>
                 <button onClick={() => setShowCancelConfirm(false)} className={`w-full py-4 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} rounded-full font-black text-[10px] uppercase tracking-widest`}>Back</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default RiderNavigation;

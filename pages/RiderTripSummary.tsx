
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, VehicleType } from '../types';

interface RiderTripSummaryProps {
  isDarkMode: boolean;
  user: User | null;
  activeRide: any;
}

const RiderTripSummary: React.FC<RiderTripSummaryProps> = ({ isDarkMode, user, activeRide }) => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(true);

  // Calculate mock earnings
  const baseFare = activeRide?.fare || 60;
  const platformFee = Math.round(baseFare * 0.15);
  const netEarnings = baseFare - platformFee;
  const distance = activeRide?.tripDistance || "4.2 km";
  
  useEffect(() => {
    // Simulate data synchronization to cloud
    const timer = setTimeout(() => setIsSyncing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const accentGreen = '#4BA678';

  if (isSyncing) {
    return (
      <div className={`min-h-full flex flex-col items-center justify-center p-8 transition-colors duration-700 ${bgColor}`}>
        <div className="w-12 h-12 border-4 border-[#4BA678]/20 border-t-[#4BA678] rounded-full animate-spin mb-6"></div>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${secondaryText}`}>Syncing ride data...</p>
      </div>
    );
  }

  const isEmergency = activeRide?.isEmergency || activeRide?.fare === 0;

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      {/* 1. HEADER */}
      <div className={`p-6 pt-12 flex flex-col items-center border-b border-black/5 ${cardBg}`}>
        <h1 className={`text-xs font-black uppercase tracking-[0.3em] ${primaryText}`}>Ride Completed</h1>
        <p className={`text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1 ${primaryText}`}>Trip summary and earnings</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-40">
        
        {/* 2. TRIP AUDIT CARD */}
        <div className={`p-8 rounded-[40px] shadow-sm border border-black/5 ${cardBg} space-y-6`}>
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className={`text-[9px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Reference ID</p>
                <p className={`text-xs font-black ${primaryText}`}>TR-{activeRide?.id?.split('-')[1] || '9211'}</p>
              </div>
              <div className="text-right">
                <p className={`text-[9px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Date & Time</p>
                <p className={`text-xs font-bold ${primaryText}`}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
           </div>

           <div className="space-y-4 py-4 border-y border-black/5">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                 <p className={`text-xs font-medium truncate opacity-60 ${primaryText}`}>{activeRide?.pickup}</p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#4BA678]"></div>
                 <p className={`text-xs font-medium truncate ${primaryText}`}>{activeRide?.drop || 'North Tripura District Hospital'}</p>
              </div>
           </div>

           <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                 <p className={`text-[8px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Distance</p>
                 <p className={`text-xs font-black ${primaryText}`}>{distance}</p>
              </div>
              <div>
                 <p className={`text-[8px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Type</p>
                 <p className={`text-xs font-black ${primaryText}`}>{activeRide?.vehicleType || 'AUTO'}</p>
              </div>
              <div>
                 <p className={`text-[8px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Persons</p>
                 <p className={`text-xs font-black ${primaryText}`}>{activeRide?.passengerCount || 1}</p>
              </div>
           </div>
        </div>

        {/* 3. EARNINGS BREAKDOWN */}
        <div className={`p-8 rounded-[40px] shadow-sm border border-black/5 ${cardBg} space-y-6`}>
           <h3 className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${primaryText}`}>Earnings Breakdown</h3>
           
           <div className="space-y-3">
              <div className="flex justify-between items-center">
                 <span className={`text-xs font-medium ${secondaryText}`}>Base Fare & Distance</span>
                 <span className={`text-xs font-bold ${primaryText}`}>₹{baseFare}</span>
              </div>
              {!isEmergency && (
                <div className="flex justify-between items-center">
                   <span className={`text-xs font-medium ${secondaryText}`}>Platform Commission (15%)</span>
                   <span className="text-xs font-bold text-red-500">-₹{platformFee}</span>
                </div>
              )}
              <div className="h-px bg-black/5 my-2"></div>
              <div className="flex justify-between items-center">
                 <span className={`text-sm font-black uppercase tracking-widest ${primaryText}`}>Net Earnings</span>
                 <span className={`text-lg font-black ${accentGreen}`}>₹{isEmergency ? '0' : netEarnings}</span>
              </div>
           </div>

           {isEmergency && (
              <div className="p-4 rounded-2xl bg-[#4BA678]/5 border border-[#4BA678]/10 text-center">
                <p className={`text-[10px] font-bold italic ${accentGreen}`}>
                   Thank you for completing this emergency ride for the community.
                </p>
              </div>
           )}
        </div>

        {/* 4. ACTIONS */}
        <div className="pt-6 space-y-3">
           <button 
             onClick={() => navigate('/')} 
             className="w-full py-5 bg-[#4BA678] text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-[#4BA678]/20 active:scale-95 transition-all"
           >
             Go Online
           </button>
           <button 
             onClick={() => navigate('/')} 
             className={`w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] ${isDarkMode ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-500'} active:scale-95 transition-all`}
           >
             Go Offline
           </button>
        </div>

        <div className="text-center pt-10 pb-10 opacity-20">
          <p className={`text-[9px] font-black uppercase tracking-[0.4em] ${primaryText}`}>Dharmanagar Mobility Service</p>
        </div>
      </div>
    </div>
  );
};

export default RiderTripSummary;

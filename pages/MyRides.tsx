
import React, { useState, useEffect } from 'react';
import { VehicleType, UserRole } from '../types';

const MyRides: React.FC<{ activeRide: any, isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [role, setRole] = useState<UserRole>(UserRole.TRAVELLER);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const user = localStorage.getItem('triyatri_user');
    if (user) setRole(JSON.parse(user).role);
  }, []);

  const isRider = role === UserRole.RIDER;
  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      <div className={`p-6 pt-12 flex justify-between items-center border-b border-black/5 ${cardBg}`}>
        <h1 className={`text-xl font-black tracking-tight ${primaryText}`}>
          {isRider ? 'Earnings Ledger' : 'My Rides'}
        </h1>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center opacity-40 transition-all active:scale-90">
            <i className="fa-solid fa-sliders text-xs"></i>
          </button>
        </div>
      </div>

      {isRider && (
        <div className="p-6">
          <div className={`p-8 rounded-[40px] shadow-sm border border-black/5 bg-gradient-to-br from-[#4BA678] to-[#2D5A43] text-white flex justify-between items-center`}>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Revenue Today</p>
              <h2 className="text-3xl font-black">₹840</h2>
            </div>
            <div className="w-14 h-14 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <i className="fa-solid fa-indian-rupee-sign text-xl"></i>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 px-6 py-4 overflow-x-auto no-scrollbar">
        {['ALL', 'COMPLETED', 'CANCELLED', 'EMERGENCY'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#4BA678] text-white shadow-lg' : 'bg-white dark:bg-white/5 opacity-40'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-40">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`p-6 rounded-[32px] border border-black/5 ${cardBg} shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-30">14 Jan • 10:30 AM</p>
                <h4 className={`text-sm font-bold truncate max-w-[200px] ${primaryText}`}>Dharmanagar Railway Station → Kalibari Temple</h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-widest">Completed</span>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <div className="flex items-center gap-2 opacity-40">
                <i className={`fa-solid ${i === 1 ? 'fa-taxi' : i === 2 ? 'fa-car' : 'fa-motorcycle'} text-xs`}></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">{i === 1 ? 'AUTO' : i === 2 ? 'CAR' : 'BIKE'}</span>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${primaryText}`}>₹{i === 2 ? '0' : '60'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRides;

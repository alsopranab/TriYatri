
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideRequest } from '../types';

interface RideCompletionProps {
  ride: RideRequest | null;
  isDarkMode: boolean;
  // Fix: Added missing onDone prop to resolve type error in App.tsx
  onDone?: () => void;
}

const RideCompletion: React.FC<RideCompletionProps> = ({ ride, isDarkMode, onDone }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  if (!ride) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const isEmergency = ride.drop.toLowerCase().includes('hospital') || ride.drop.toLowerCase().includes('medical');

  // Styling
  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]/95' : 'bg-white/95';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const brandSageText = 'text-[#4BA678]';
  const brandSageBg = 'bg-[#4BA678]';

  const tags = ["Smooth ride", "On time", "Polite rider", "Clean vehicle", "Safe driving"];

  return (
    <div className={`min-h-full flex flex-col p-8 pt-20 pb-12 transition-all duration-700 ${bgColor}`}>
      
      {/* 1. COMPLETION CONFIRMATION */}
      <div className="text-center space-y-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-sm ${isDarkMode ? 'bg-white/5 text-white/20' : 'bg-[#4BA678]/10 text-[#4BA678]'}`}>
          <i className="fa-solid fa-check text-2xl"></i>
        </div>
        <div className="space-y-1">
          <h1 className={`text-2xl font-semibold tracking-tight ${primaryText}`}>Ride Completed</h1>
          <p className={`text-sm ${secondaryText}`}>Hope you had a safe journey</p>
        </div>
      </div>

      {/* 2. RIDE SUMMARY CARD */}
      <div className={`p-8 rounded-[40px] shadow-sm border border-white/10 ${cardBg} mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700`}>
        <div className="flex justify-between items-start mb-8">
           <div className="space-y-1">
             <p className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Total Fare</p>
             <div className="flex items-baseline gap-1">
               <span className={`text-3xl font-bold ${primaryText}`}>₹{ride.fare || '0'}</span>
               {ride.fare === 0 && <span className={`text-xs font-medium ${brandSageText}`}>Emergency</span>}
             </div>
           </div>
           <div className={`px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} text-center`}>
              <p className={`text-[8px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Method</p>
              <p className={`text-[10px] font-bold ${primaryText}`}>CASH</p>
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
              <div className="space-y-0.5">
                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Pickup</p>
                <p className={`text-xs font-medium truncate max-w-[200px] ${primaryText}`}>{ride.pickup}</p>
              </div>
           </div>
           <div className="flex items-start gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4BA678] mt-1.5"></div>
              <div className="space-y-0.5">
                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-30 ${primaryText}`}>Drop</p>
                <p className={`text-xs font-medium truncate max-w-[200px] ${primaryText}`}>{ride.drop}</p>
              </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/5 flex justify-between items-center">
           <div className="text-center">
             <p className={`text-[9px] font-bold uppercase opacity-30 ${primaryText}`}>Distance</p>
             <p className={`text-xs font-bold ${primaryText}`}>4.2 km</p>
           </div>
           <div className="text-center">
             <p className={`text-[9px] font-bold uppercase opacity-30 ${primaryText}`}>Type</p>
             <p className={`text-xs font-bold ${primaryText}`}>{ride.vehicleType}</p>
           </div>
           <div className="text-center">
             <p className={`text-[9px] font-bold uppercase opacity-30 ${primaryText}`}>Time</p>
             <p className={`text-xs font-bold ${primaryText}`}>14 min</p>
           </div>
        </div>
      </div>

      {/* 3. FEEDBACK SECTION */}
      {!isEmergency && (
        <div className="space-y-6 animate-in fade-in duration-1000 delay-300">
          <div className="text-center space-y-4">
            <p className={`text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 ${primaryText}`}>Rate your rider</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-all ${rating >= star ? 'text-amber-400 scale-110' : 'text-slate-200 opacity-50'}`}
                >
                  <i className={`fa-solid fa-star`}></i>
                </button>
              ))}
            </div>
          </div>

          {rating > 0 && (
            <div className="flex flex-wrap justify-center gap-2 animate-in fade-in zoom-in-95 duration-500">
               {tags.map(tag => (
                 <button 
                   key={tag} 
                   onClick={() => toggleTag(tag)}
                   className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedTags.includes(tag) ? 'bg-[#4BA678] text-white border-[#4BA678]' : `border-black/5 ${primaryText} opacity-40`}`}
                 >
                   {tag}
                 </button>
               ))}
            </div>
          )}
        </div>
      )}

      {isEmergency && (
        <div className={`p-6 rounded-[32px] text-center ${isDarkMode ? 'bg-white/5' : 'bg-[#4BA678]/5'} animate-in fade-in duration-1000`}>
           <p className={`text-xs font-medium ${brandSageText}`}>
             Thank you for using TriYatri for this important trip. We hope everything is well.
           </p>
        </div>
      )}

      {/* 4. NEXT ACTIONS */}
      <div className="mt-auto pt-10 space-y-4">
        <button 
          onClick={() => {
            // Fix: Call onDone callback if provided before navigating
            if (onDone) onDone();
            navigate('/');
          }}
          className={`w-full py-5 ${brandSageBg} text-white rounded-full font-semibold text-base shadow-lg transition-all active:scale-[0.98]`}
        >
          Back to Home
        </button>
        <div className="flex justify-center gap-8">
           <button className={`text-[10px] font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity ${primaryText}`}>Report an issue</button>
           <button className={`text-[10px] font-bold uppercase tracking-widest opacity-20 hover:opacity-100 transition-opacity ${primaryText}`}>View Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default RideCompletion;

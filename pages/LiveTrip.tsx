
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideRequest, UserRole } from '../types';
import MapOverlay from '../components/MapOverlay';

interface LiveTripProps {
  ride: RideRequest | null;
  isDarkMode: boolean;
}

const LiveTrip: React.FC<LiveTripProps> = ({ ride, isDarkMode }) => {
  const navigate = useNavigate();
  const [currentPos, setCurrentPos] = useState({ lat: 24.3735, lng: 92.1624 });
  const [timeLeft, setTimeLeft] = useState(12);
  const [distanceLeft, setDistanceLeft] = useState(3.2);
  const [isRiderMode, setIsRiderMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('triyatri_user');
    if (user) {
      const parsed = JSON.parse(user);
      setIsRiderMode(parsed.role === UserRole.RIDER);
    }
  }, []);

  useEffect(() => {
    const tripInterval = setInterval(() => {
      setCurrentPos(prev => ({
        lat: prev.lat - 0.00008,
        lng: prev.lng + 0.00006
      }));
      setTimeLeft(prev => Math.max(0, prev - 1));
      setDistanceLeft(prev => Math.max(0, prev - 0.2));
    }, 5000);

    return () => clearInterval(tripInterval);
  }, [ride]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => navigate(isRiderMode ? '/rider-summary' : '/completion'), 2000);
    }
  }, [timeLeft, navigate, isRiderMode]);

  const handleShare = (method: 'whatsapp' | 'sms' | 'copy') => {
    const trackingId = ride?.id?.split('-')[1] || Math.floor(Math.random() * 10000);
    const destination = ride?.drop || 'Destination';
    const shareText = `🛡️ TriYatri Safety: I am on my way to ${destination}. \n\nLive Track my journey here: https://triyatri.com/track/${trackingId} \n\nVehicle: TR 05 B 2234 (Auto) \nShared via TriYatri Dharmanagar.`;
    
    if (method === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (method === 'sms') {
      // For cross-platform compatibility, use ; on iOS and ? on Android if needed, 
      // but ? is generally safer for body param.
      window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
    } else if (method === 'copy') {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Success! Tracking details copied to clipboard.");
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
    setShowShareModal(false);
  };

  const isEmergency = ride?.drop?.toLowerCase().includes('hospital');

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]/95' : 'bg-white/95';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const brandSageText = 'text-[#4BA678]';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden transition-all duration-700 ${bgColor}`}>
      <div className="absolute inset-0 z-0">
        <MapOverlay center={currentPos} destinationCoords={{ lat: 24.3667, lng: 92.1667 }} isEmergency={isEmergency} />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.1)] bg-gradient-to-b from-white/10 to-transparent"></div>
      </div>

      <div className="absolute top-14 left-0 right-0 z-50 px-6 pointer-events-none">
        <div className={`mx-auto max-w-sm py-4 px-8 rounded-full shadow-2xl border border-white/10 text-center backdrop-blur-2xl ${cardBg} pointer-events-auto flex items-center justify-center gap-4`}>
           <div className={`w-2.5 h-2.5 rounded-full ${isEmergency ? 'bg-red-500 animate-ping' : 'bg-[#4BA678] animate-pulse'}`}></div>
           <div className="text-left">
              <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${isEmergency ? 'text-red-500' : brandSageText}`}>
                {isEmergency ? 'Priority Route' : 'Trip in Progress'}
              </p>
              <h2 className={`text-xs font-black truncate max-w-[150px] ${primaryText}`}>to {ride?.drop || 'Destination'}</h2>
           </div>
        </div>
      </div>

      <div className="mt-auto relative z-30 p-6 space-y-4 pb-32">
        <div className={`p-8 rounded-[40px] shadow-2xl backdrop-blur-3xl border border-white/10 ${cardBg} flex justify-between items-center animate-in slide-in-from-bottom-10`}>
           <div>
              <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${primaryText}`}>ETA</p>
              <div className="flex items-baseline gap-1">
                 <span className={`text-3xl font-black ${primaryText}`}>{timeLeft}</span>
                 <span className={`text-[10px] font-bold opacity-40 ${primaryText}`}>MIN</span>
              </div>
           </div>
           <div className="h-10 w-px bg-black/5"></div>
           <div className="text-right">
              <p className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${primaryText}`}>Distance</p>
              <div className="flex items-baseline gap-1 justify-end">
                 <span className={`text-3xl font-black ${primaryText}`}>{distanceLeft.toFixed(1)}</span>
                 <span className={`text-[10px] font-bold opacity-40 ${primaryText}`}>KM</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
           <button onClick={() => setShowShareModal(true)} className={`col-span-3 py-5 rounded-[30px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 backdrop-blur-2xl border border-white/10 ${cardBg} shadow-xl active:scale-95 transition-all ${brandSageText}`}>
              <i className="fa-solid fa-share-nodes"></i>
              Share Journey Details
           </button>
           <button onClick={() => alert("SOS Alert Sent to Emergency Contacts")} className={`h-16 rounded-[30px] bg-red-500 text-white shadow-xl shadow-red-500/20 flex items-center justify-center text-xl active:scale-90 transition-all`}>
              <i className="fa-solid fa-shield-heart"></i>
           </button>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`w-full p-8 pb-12 rounded-t-[50px] shadow-2xl ${cardBg} border-t border-white/20 animate-in slide-in-from-bottom-full duration-500`}>
             <div className="w-12 h-1.5 bg-slate-300 mx-auto mb-8 rounded-full"></div>
             <h3 className={`text-lg font-black text-center mb-6 tracking-tight ${primaryText}`}>Safety Share</h3>
             <div className="grid grid-cols-3 gap-4">
                <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-3 group">
                   <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 text-2xl group-active:scale-90 transition-transform">
                      <i className="fa-brands fa-whatsapp"></i>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>WhatsApp</span>
                </button>
                <button onClick={() => handleShare('sms')} className="flex flex-col items-center gap-3 group">
                   <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl group-active:scale-90 transition-transform">
                      <i className="fa-solid fa-comment-sms"></i>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Message</span>
                </button>
                <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-3 group">
                   <div className="w-16 h-16 rounded-3xl bg-slate-500/10 flex items-center justify-center text-slate-500 text-2xl group-active:scale-90 transition-transform">
                      <i className="fa-solid fa-link"></i>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 ${primaryText}`}>Copy Link</span>
                </button>
             </div>
             <button onClick={() => setShowShareModal(false)} className={`w-full mt-10 py-5 rounded-full border border-black/5 font-black text-[10px] uppercase tracking-widest ${primaryText} active:bg-black/5`}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTrip;

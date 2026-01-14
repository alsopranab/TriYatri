
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideRequest, RideStatus } from '../types';
import MapOverlay from '../components/MapOverlay';

const RideConfirmation: React.FC<{ ride: RideRequest | null, isDarkMode: boolean, setActiveRide: (ride: any) => void }> = ({ ride, isDarkMode, setActiveRide }) => {
  const navigate = useNavigate();
  const [matchStatus, setMatchStatus] = useState<'SEARCHING' | 'NOTIFYING' | 'FOUND'>('SEARCHING');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!ride) {
      navigate('/');
      return;
    }

    const notifyTimer = setTimeout(() => setMatchStatus('NOTIFYING'), 4000);
    const foundTimer = setTimeout(() => setMatchStatus('FOUND'), 9000);

    return () => {
      clearTimeout(notifyTimer);
      clearTimeout(foundTimer);
    };
  }, [ride, navigate]);

  useEffect(() => {
    if (matchStatus === 'FOUND') {
      const transitionTimer = setTimeout(() => {
        navigate('/tracker');
      }, 1500);
      return () => clearTimeout(transitionTimer);
    }
  }, [matchStatus, navigate]);

  const handleCancel = () => {
    setActiveRide(null); 
    navigate('/');       
  };

  const handleModify = () => {
    setActiveRide(null);
    navigate('/'); // Returns home with state cleared to pick new location
  };

  const handleCancelWithIssue = () => {
    navigate('/report', { state: { fromCancellation: true, rideId: ride?.id } });
  };

  if (!ride) return null;

  const cardBg = isDarkMode ? 'bg-[#1A1D29]/95' : 'bg-white/95';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden ${isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]'}`}>
      <div className="absolute inset-0 z-0 h-[60%]">
        <MapOverlay center={{ lat: 24.3735, lng: 92.1624 }} destinationCoords={{ lat: 24.3667, lng: 92.1667 }} />
      </div>

      <div className={`mt-auto relative z-30 rounded-t-[40px] shadow-2xl flex flex-col p-8 pb-16 ${cardBg} border-t border-white/10`}>
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
               {matchStatus !== 'FOUND' && <div className="w-2 h-2 rounded-full bg-[#4BA678] animate-ping"></div>}
               <h2 className={`text-xl font-black tracking-tight ${primaryText}`}>
                 {matchStatus === 'SEARCHING' && "Finding your ride..."}
                 {matchStatus === 'NOTIFYING' && "Riders are nearby"}
                 {matchStatus === 'FOUND' && "Ride Confirmed!"}
               </h2>
            </div>
            <p className="text-xs opacity-50 px-4 leading-relaxed">
              We are connecting you with local partners in Dharmanagar. Please wait a moment.
            </p>
          </div>

          <div className="w-full grid gap-3">
            <button 
              onClick={() => setShowCancelConfirm(true)} 
              className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 font-black text-[10px] uppercase tracking-widest opacity-80"
            >
              Cancel Request
            </button>
            <div className="flex gap-3">
              <button 
                onClick={handleModify}
                className="flex-1 py-3 text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-pen-to-square"></i> Modify Trip
              </button>
              <button 
                onClick={handleCancelWithIssue}
                className="flex-1 py-3 text-[9px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-circle-exclamation"></i> Report Issue
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-8 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-sm p-8 rounded-[40px] ${cardBg} text-center space-y-6 border border-white/10`}>
            <h3 className="text-lg font-black">Cancel Search?</h3>
            <p className="text-xs opacity-40">Did you put a wrong location? You can modify the trip instead.</p>
            <div className="grid gap-3">
               <button onClick={handleModify} className="w-full py-4 bg-[#4BA678] text-white rounded-full font-black text-[10px] uppercase tracking-widest">Update Location</button>
               <button onClick={handleCancel} className="w-full py-4 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest">Just Cancel</button>
               <button onClick={() => setShowCancelConfirm(false)} className={`w-full py-4 rounded-full font-black text-[10px] uppercase ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>Keep Waiting</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RideConfirmation;

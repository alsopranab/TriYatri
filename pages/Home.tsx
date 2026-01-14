
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VehicleType, RideStatus, User, RideRequest } from '../types';
import MapOverlay from '../components/MapOverlay';
import { getSmartLocationSuggestions } from '../services/geminiService';

interface VehicleOption {
  id: string;
  type: VehicleType;
  category: string;
  label: string;
  capacity: number;
  baseFare: number;
  icon: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: 'v1', type: VehicleType.BIKE, category: 'Quick', label: 'Bike', capacity: 1, baseFare: 15, icon: 'fa-motorcycle' },
  { id: 'v2', type: VehicleType.E_RICKSHAW, category: 'Community', label: 'E-Rickshaw', capacity: 5, baseFare: 20, icon: 'fa-bolt' },
  { id: 'v3', type: VehicleType.AUTO, category: 'Local', label: 'Auto', capacity: 4, baseFare: 30, icon: 'fa-taxi' },
  { id: 'v4', type: VehicleType.CAR, category: 'Comfort', label: 'Car Standard', capacity: 4, baseFare: 60, icon: 'fa-car-side' }
];

const SAVED_PLACES = [
  { id: 'home', label: 'Home', icon: 'fa-house', address: 'Baluar Ghat, Dharmanagar' },
  { id: 'office', label: 'Office', icon: 'fa-briefcase', address: 'DM Office Complex' },
  { id: 'friend', label: "Friend's Place", icon: 'fa-heart', address: 'Nayapara, Dharmanagar' }
];

const RECENT_RIDES = [
  "Dharmanagar Railway Station",
  "North Tripura District Hospital",
  "Kalibari Temple, Dharmanagar"
];

const Home: React.FC<{ setActiveRide: (ride: any) => void, activeRide: RideRequest | null, isDarkMode: boolean, user: User | null }> = ({ setActiveRide, activeRide, isDarkMode, user }) => {
  const navigate = useNavigate();
  const [pickup] = useState('Dharmanagar Railway Station');
  const [drop, setDrop] = useState('');
  const [dropCoords, setDropCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('v2');
  const [suggestions, setSuggestions] = useState<{name: string}[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  
  const [scheduleDate, setScheduleDate] = useState('Today');
  const [scheduleTime, setScheduleTime] = useState('09:30 AM');

  useEffect(() => {
    if (activeRide && activeRide.status !== RideStatus.COMPLETED) {
      if (activeRide.status === RideStatus.SEARCHING) navigate('/confirm');
      else if (activeRide.status === RideStatus.ASSIGNED) navigate('/tracker');
      else if (activeRide.status === RideStatus.LIVE) navigate('/trip');
    }
  }, [activeRide, navigate]);

  const handleInputChange = async (val: string) => {
    setDrop(val);
    if (val.length > 1) {
      const results = await getSmartLocationSuggestions(val);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };

  const selectLocation = (name: string) => {
    setDrop(name);
    setDropCoords({lat: 24.36, lng: 92.17}); // Mock coordinates
    setIsSearching(false);
  };

  const selectedVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId);
  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className={`relative h-full flex flex-col overflow-hidden ${bgColor}`}>
      <div className="absolute inset-0 z-0 h-full">
        <MapOverlay center={{ lat: 24.3735, lng: 92.1624 }} destinationCoords={dropCoords} />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.1)]"></div>
      </div>

      <div className="absolute top-12 left-0 right-0 z-50 px-6 space-y-2 pointer-events-none">
        <div className={`pointer-events-auto w-full p-4 rounded-3xl flex items-center gap-4 text-left border border-black/5 shadow-xl backdrop-blur-3xl ${isDarkMode ? 'bg-[#1A1D29]/70' : 'bg-white/70'}`}>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Pickup</p>
            <p className="text-xs font-bold truncate">{pickup}</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsSearching(true)} 
          className={`pointer-events-auto w-full p-4 rounded-3xl flex items-center gap-4 text-left border border-black/5 shadow-2xl backdrop-blur-3xl transition-transform active:scale-95 ${isDarkMode ? 'bg-[#1A1D29]/90' : 'bg-white/90'}`}
        >
          <div className="w-2 h-2 rounded-full bg-[#4BA678]"></div>
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Destination</p>
            <p className={`text-xs font-bold truncate ${drop ? primaryText : 'opacity-30'}`}>
              {drop || `Hi ${firstName}, where are we going today?`}
            </p>
          </div>
          <i className="fa-solid fa-magnifying-glass text-xs opacity-20 mr-2"></i>
        </button>
      </div>

      <div className={`mt-auto relative z-10 rounded-t-[48px] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] border-t border-white/10 ${cardBg} transition-all duration-500`}>
        <div className="w-full p-6 pb-24">
          <div className="w-12 h-1 bg-slate-300/30 rounded-full mx-auto mb-6"></div>
          
          {!drop ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-2">
                <i className="fa-solid fa-map-location-dot text-[#4BA678] text-xl"></i>
              </div>
              <h3 className={`text-lg font-black ${primaryText}`}>Hi {firstName}, where to?</h3>
              <p className="text-xs opacity-40 px-10 leading-relaxed">Select a destination to see available rides and pricing in your area.</p>
              <button 
                onClick={() => setIsSearching(true)}
                className="px-8 py-3 rounded-full bg-[#4BA678] text-white text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95"
              >
                Find a Ride
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-5 px-1">
                <h2 className={`text-lg font-black ${primaryText}`}>Select Ride</h2>
                <button onClick={() => setShowSchedule(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest opacity-60">
                  <i className="fa-solid fa-calendar"></i> Schedule
                </button>
              </div>

              <div className="grid gap-2 mb-6 max-h-[280px] overflow-y-auto no-scrollbar">
                {VEHICLE_OPTIONS.map(v => (
                  <button 
                    key={v.id} 
                    onClick={() => setSelectedVehicleId(v.id)} 
                    className={`w-full p-3.5 rounded-[24px] border flex items-center gap-4 transition-all ${selectedVehicleId === v.id ? 'bg-[#4BA678]/10 border-[#4BA678]' : 'border-black/5 bg-slate-50/30'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedVehicleId === v.id ? 'bg-[#4BA678] text-white' : 'bg-slate-100 text-[#4BA678]'}`}>
                      <i className={`fa-solid ${v.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-xs font-black">{v.label}</h4>
                      <p className="text-[8px] opacity-40 uppercase font-black">{v.category} • {v.capacity} Pax</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black">₹{v.baseFare}</p>
                      <p className="text-[7px] font-black opacity-30 uppercase tracking-tighter">Approx</p>
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  const ride = { id: 'TR-'+Date.now(), pickup, drop, passengerCount: 1, vehicleType: selectedVehicle?.type as any, status: RideStatus.SEARCHING, fare: selectedVehicle?.baseFare || 60, timestamp: Date.now() };
                  setActiveRide(ride);
                  navigate('/confirm');
                }}
                className="w-full py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] bg-[#4BA678] text-white shadow-2xl active:scale-[0.98] transition-all"
              >
                Request {selectedVehicle?.label}
              </button>
            </div>
          )}
        </div>
      </div>

      {isSearching && (
        <div className={`fixed inset-0 z-[100] flex flex-col ${cardBg}`}>
          <div className="p-6 pt-12 border-b border-black/5">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setIsSearching(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h3 className="font-bold">Destination</h3>
            </div>
            <div className="relative">
              <input 
                autoFocus 
                value={drop} 
                onChange={(e) => handleInputChange(e.target.value)} 
                placeholder={`Hi ${firstName}, where are we going today?`} 
                className={`w-full p-5 pl-12 rounded-3xl border border-black/5 bg-slate-50 dark:bg-white/5 text-lg font-bold outline-none ${primaryText}`} 
              />
              <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 opacity-20"></i>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
            {!drop && (
              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-4 px-1">Saved Places</p>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {SAVED_PLACES.map(place => (
                    <button 
                      key={place.id}
                      onClick={() => selectLocation(place.address)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-3xl border border-black/5 ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} min-w-[100px] active:scale-95 transition-all`}
                    >
                      <div className="w-10 h-10 rounded-2xl bg-[#4BA678]/10 text-[#4BA678] flex items-center justify-center">
                        <i className={`fa-solid ${place.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-bold truncate w-full text-center">{place.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-2 px-1">
                {drop ? 'Search Results' : 'Recent Destinations'}
              </p>
              
              {(drop ? suggestions : RECENT_RIDES.map(r => ({name: r}))).map((s, i) => (
                <button 
                  key={i} 
                  onClick={() => selectLocation(s.name)} 
                  className="w-full p-5 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center gap-4 text-left border border-transparent hover:border-[#4BA678]/30 transition-all"
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${drop ? 'bg-[#4BA678]/10 text-[#4BA678]' : 'bg-slate-200/50 text-slate-500'}`}>
                    <i className={`fa-solid ${drop ? 'fa-location-dot' : 'fa-clock-rotate-left'}`}></i>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold block truncate">{s.name}</span>
                    <span className="text-[9px] opacity-40 uppercase font-black">{drop ? 'Landmark' : 'Recent Ride'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSchedule && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full p-8 pb-12 rounded-t-[50px] ${cardBg} animate-in slide-in-from-bottom-full`}>
             <div className="w-12 h-1.5 bg-slate-300 mx-auto mb-8 rounded-full"></div>
             <h3 className="text-xl font-black text-center mb-8">Schedule Trip</h3>
             <div className="space-y-6 mb-10">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Select Date</p>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['Today', 'Tomorrow', '18 Feb', '19 Feb'].map(d => (
                      <button key={d} onClick={() => setScheduleDate(d)} className={`px-6 py-4 rounded-3xl border whitespace-nowrap text-sm font-bold transition-all ${scheduleDate === d ? 'bg-[#4BA678] text-white border-[#4BA678]' : 'bg-slate-50 dark:bg-white/5 border-black/5'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Select Time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['08:00 AM', '09:30 AM', '12:00 PM', '02:00 PM', '05:00 PM', '08:30 PM'].map(t => (
                      <button key={t} onClick={() => setScheduleTime(t)} className={`py-3 rounded-2xl border text-[10px] font-bold transition-all ${scheduleTime === t ? 'bg-[#4BA678] text-white border-[#4BA678]' : 'bg-slate-50 dark:bg-white/5 border-black/5'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
             <button onClick={() => setShowSchedule(false)} className="w-full py-5 rounded-full bg-[#4BA678] text-white font-black text-[10px] uppercase tracking-widest shadow-xl">Confirm Schedule</button>
             <button onClick={() => setShowSchedule(false)} className="w-full mt-4 text-[10px] font-bold opacity-30 uppercase">Go Back</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

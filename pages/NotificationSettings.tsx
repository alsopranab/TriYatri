
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

const NotificationSettings: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.TRAVELLER);
  
  const [settings, setSettings] = useState({
    rides: true,
    safety: true,
    promo: false,
    sms: true,
    earnings: true,
    jobAlerts: true
  });

  useEffect(() => {
    const user = localStorage.getItem('triyatri_user');
    if (user) setRole(JSON.parse(user).role);
  }, []);

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isRider = role === UserRole.RIDER;
  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  // Role-specific notification rows
  const passengerRows = [
    { key: 'rides', label: 'Ride Updates', desc: 'Alerts for trip status and driver location' },
    { key: 'safety', label: 'Safety Alerts', desc: 'Critical notifications during emergency mode' },
    { key: 'promo', label: 'Offers & News', desc: 'Updates on local fare discounts and events' },
    { key: 'sms', label: 'SMS Notifications', desc: 'Backup alerts when internet is offline' }
  ];

  const riderRows = [
    { key: 'jobAlerts', label: 'New Job Alerts', desc: 'Immediate notifications for nearby ride requests' },
    { key: 'earnings', label: 'Earnings Summary', desc: 'Daily and weekly revenue reports' },
    { key: 'safety', label: 'Dispatch Safety', desc: 'Priority alerts from the command center' },
    { key: 'sms', label: 'Offline Booking', desc: 'Get trip details via SMS when data is low' }
  ];

  const activeRows = isRider ? riderRows : passengerRows;

  return (
    <div className={`min-h-full flex flex-col transition-all duration-500 ${bgColor}`}>
      <div className={`sticky top-0 z-50 h-16 flex items-center gap-4 px-6 border-b ${dividerColor} ${cardBg}`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 flex items-center justify-start ${primaryText}`}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className={`text-lg font-bold ${primaryText}`}>
          {isRider ? 'Rider Notifications' : 'Notification Preferences'}
        </h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="px-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
                {isRider ? 'Driver Dispatch Settings' : 'Passenger Alert Settings'}
            </p>
        </div>
        
        <div className={`rounded-[32px] overflow-hidden border ${dividerColor} ${cardBg} shadow-sm`}>
          {activeRows.map((row, i) => (
            <div key={row.key} className={`p-6 flex items-center justify-between ${i !== activeRows.length - 1 ? 'border-b' : ''} ${dividerColor}`}>
              <div className="flex-1 pr-4">
                <p className={`text-sm font-bold ${primaryText}`}>{row.label}</p>
                <p className="text-[10px] font-medium opacity-40 leading-tight">{row.desc}</p>
              </div>
              <button 
                onClick={() => toggle(row.key as any)}
                className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${settings[row.key as keyof typeof settings] ? 'bg-[#4BA678]' : 'bg-slate-200 dark:bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings[row.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 text-center">
            <p className="text-[9px] font-medium opacity-30 leading-relaxed">
                Settings are synced with your TriYatri {isRider ? 'Rider' : 'Passenger'} account for regional reliability.
            </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;

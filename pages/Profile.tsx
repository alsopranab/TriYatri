
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, User } from '../types';

interface ProfileProps {
  isDarkMode: boolean;
  onLogout: () => void;
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  toggleTheme: () => void;
}

const Profile: React.FC<ProfileProps> = ({ isDarkMode, onLogout, user, onUpdateUser, toggleTheme }) => {
  const navigate = useNavigate();
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const isRider = user?.role === UserRole.RIDER;
  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  const handleRoleSwitch = () => {
    if (!user || isSwitching) return;
    
    setIsSwitching(true);
    setTimeout(() => {
      const nextRole = isRider ? UserRole.TRAVELLER : UserRole.RIDER;
      const updatedUser = { ...user, role: nextRole };
      localStorage.setItem('triyatri_user', JSON.stringify(updatedUser));
      onUpdateUser(updatedUser);
      setIsSwitching(false);
      setShowSwitchModal(false);
      navigate('/', { replace: true });
    }, 600);
  };

  return (
    <div className={`min-h-full flex flex-col transition-all duration-400 ease-in-out ${bgColor}`}>
      <div className={`sticky top-0 z-50 h-16 flex items-center justify-between px-6 border-b ${dividerColor} ${cardBg}`}>
        <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>
            {isRider ? 'Rider Console' : 'My Account'}
        </h1>
        <button onClick={toggleTheme} className={`w-10 h-10 flex items-center justify-end ${primaryText}`}>
          <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="px-6 py-10 space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[28px] bg-[#4BA678] flex items-center justify-center text-white text-3xl font-black shadow-lg">
                {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="space-y-1">
                <h2 className={`text-2xl font-black tracking-tighter ${primaryText}`}>{user?.name}</h2>
                <p className={`text-sm font-bold opacity-40 ${primaryText}`}>{user?.phone}</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-[#4BA678] bg-[#4BA678]/10 border border-[#4BA678]/20`}>
                    {isRider ? 'Professional Rider' : 'Verified Traveller'}
                </div>
            </div>
          </div>
          <button onClick={() => navigate('/profile/edit')} className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4BA678] pt-2">
            Edit Profile Details <i className="fa-solid fa-chevron-right ml-1 text-[8px]"></i>
          </button>
        </div>

        <div className="px-4 space-y-2 mb-8">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Platform Mode</p>
          <div className={`rounded-[32px] overflow-hidden border ${dividerColor} ${cardBg} shadow-sm`}>
            <button 
              onClick={() => setShowSwitchModal(true)} 
              disabled={isSwitching}
              className={`w-full p-6 flex items-center justify-between active:bg-black/5 text-left transition-colors ${isSwitching ? 'opacity-50' : ''}`}
            >
              <div>
                <h3 className={`text-sm font-bold ${primaryText}`}>
                  {isSwitching ? 'Switching Mode...' : `Switch to ${isRider ? 'Passenger' : 'Driver'}`}
                </h3>
                <p className={`text-[10px] font-medium ${secondaryText}`}>
                  {isRider ? 'Currently in Earning Mode' : 'Currently in Booking Mode'}
                </p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${isRider ? 'bg-[#4BA678]' : 'bg-slate-200 dark:bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isRider ? 'translate-x-6' : 'translate-x-0'} ${isSwitching ? 'animate-pulse' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        <div className="px-4 space-y-2 mb-8">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
            {isRider ? 'Duty & Compliance' : 'Safety & Support'}
          </p>
          <div className={`rounded-[32px] overflow-hidden border ${dividerColor} ${cardBg} shadow-sm`}>
            {isRider && (
                <button onClick={() => navigate('/profile/documents')} className="w-full p-6 flex items-center justify-between border-b border-black/5 active:bg-black/5 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-[#4BA678]">
                            <i className="fa-solid fa-file-invoice text-xs"></i>
                        </div>
                        <p className={`text-xs font-bold ${primaryText}`}>Rider Documents</p>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
                </button>
            )}
            
            <button onClick={() => navigate('/emergency-contacts')} className="w-full p-6 flex items-center justify-between border-b border-black/5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-[#4BA678]">
                  <i className="fa-solid fa-heart-pulse text-xs"></i>
                </div>
                <p className={`text-xs font-bold ${primaryText}`}>Emergency Contacts</p>
              </div>
              <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
            </button>

            <button onClick={() => navigate('/safety')} className="w-full p-6 flex items-center justify-between border-b border-black/5">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-[#4BA678]">
                  <i className="fa-solid fa-shield-halved text-xs"></i>
                </div>
                <p className={`text-xs font-bold ${primaryText}`}>{isRider ? 'Rider Guidelines' : 'Community Rules'}</p>
              </div>
              <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
            </button>
            <button onClick={() => navigate('/report')} className="w-full p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 text-red-500/60">
                  <i className="fa-solid fa-circle-exclamation text-xs"></i>
                </div>
                <p className={`text-xs font-bold ${primaryText}`}>Help & Support</p>
              </div>
              <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
            </button>
          </div>
        </div>

        <div className="px-4 space-y-2 mb-8">
          <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Preferences</p>
          <div className={`rounded-[32px] overflow-hidden border ${dividerColor} ${cardBg} shadow-sm`}>
            <button onClick={() => navigate('/profile/language')} className="w-full p-6 flex items-center justify-between border-b border-black/5">
              <span className={`text-xs font-bold ${primaryText}`}>Language Selection</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold opacity-30 uppercase">English</span>
                <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
              </div>
            </button>
            <button onClick={() => navigate('/profile/notifications')} className="w-full p-6 flex items-center justify-between">
              <span className={`text-xs font-bold ${primaryText}`}>Notifications</span>
              <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
            </button>
          </div>
        </div>

        <div className="px-6 flex flex-col items-center">
          <button onClick={() => setShowLogoutModal(true)} className="w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 hover:text-red-500 transition-all">Sign Out</button>
          <div className="pt-16 pb-10 text-center space-y-2">
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${primaryText} opacity-30`}>v1.0.4 • DHARMANAGAR</p>
            <p className={`text-[11px] font-bold uppercase tracking-[0.1em] ${primaryText} opacity-60`}>By the People of Tripura, for the People of Tripura.</p>
          </div>
        </div>
      </div>

      {showSwitchModal && (
        <RoleSwitchModal 
          onConfirm={handleRoleSwitch} 
          onCancel={() => setShowSwitchModal(false)} 
          targetRole={isRider ? "Passenger" : "Driver"} 
          isSwitching={isSwitching}
        />
      )}
      {showLogoutModal && <LogoutModal onConfirm={onLogout} onCancel={() => setShowLogoutModal(false)} />}
    </div>
  );
};

const RoleSwitchModal: React.FC<{ onConfirm: () => void; onCancel: () => void; targetRole: string; isSwitching: boolean }> = ({ onConfirm, onCancel, targetRole, isSwitching }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-8 bg-black/60 backdrop-blur-sm animate-in fade-in">
    <div className="w-full max-w-xs bg-white dark:bg-[#1A1D29] rounded-[40px] p-8 text-center space-y-6 shadow-2xl border border-white/10">
      <div className="space-y-2">
        <h4 className="text-lg font-black dark:text-white">Switch Mode?</h4>
        <p className="text-xs text-slate-500 dark:text-white/40">Enter {targetRole} mode to access {targetRole === "Driver" ? "job opportunities" : "ride bookings"}.</p>
      </div>
      <div className="grid gap-3">
        <button 
          onClick={onConfirm} 
          disabled={isSwitching}
          className="w-full py-4 bg-[#4BA678] text-white rounded-full font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          {isSwitching ? 'Switching...' : 'Switch Now'}
        </button>
        <button 
          onClick={onCancel} 
          disabled={isSwitching}
          className="w-full py-4 bg-slate-100 dark:bg-white/5 dark:text-white rounded-full font-black text-[10px] uppercase tracking-widest"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
);

const LogoutModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center px-8 bg-black/60 backdrop-blur-sm animate-in fade-in">
    <div className="w-full max-w-xs bg-white dark:bg-[#1A1D29] rounded-[40px] p-8 text-center space-y-6 shadow-2xl border border-white/10">
      <h4 className="text-lg font-black dark:text-white">Sign Out?</h4>
      <p className="text-xs text-slate-500 dark:text-white/40">You will need to verify your number again to log back in.</p>
      <div className="grid gap-3">
        <button onClick={onConfirm} className="w-full py-4 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-widest">Confirm Exit</button>
        <button onClick={onCancel} className="w-full py-4 bg-slate-100 dark:bg-white/5 dark:text-white rounded-full font-black text-[10px] uppercase tracking-widest">Cancel</button>
      </div>
    </div>
  </div>
);

export default Profile;

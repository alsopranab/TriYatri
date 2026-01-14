
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface EditProfileProps {
  isDarkMode: boolean;
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isDarkMode, user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState('Dharmanagar, North Tripura');
  const [saving, setSaving] = useState(false);

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  const handleSave = () => {
    if (!user || name.length < 2) return;
    setSaving(true);
    setTimeout(() => {
      const updated = { ...user, name };
      localStorage.setItem('triyatri_user', JSON.stringify(updated));
      onUpdateUser(updated);
      setSaving(false);
      navigate(-1);
    }, 800);
  };

  return (
    <div className={`min-h-full flex flex-col transition-all duration-500 ${bgColor}`}>
      <div className={`sticky top-0 z-50 h-16 flex items-center gap-4 px-6 border-b ${dividerColor} ${cardBg}`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 flex items-center justify-start ${primaryText}`}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className={`text-lg font-bold ${primaryText}`}>Edit Profile</h1>
      </div>

      <div className="p-6 space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-[32px] bg-[#4BA678] flex items-center justify-center text-white text-4xl font-black mb-4">
            {name.charAt(0) || 'U'}
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-[#4BA678] opacity-50">Change Photo</button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-1">Full Name</label>
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-4 rounded-2xl border ${dividerColor} ${cardBg} text-sm font-bold ${primaryText} focus:border-[#4BA678] outline-none transition-all`}
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-1">Mobile Number</label>
            <div className={`w-full p-4 rounded-2xl border ${dividerColor} bg-black/5 text-sm font-bold opacity-40 ${primaryText} flex justify-between`}>
              <span>{user?.phone}</span>
              <i className="fa-solid fa-lock text-[10px]"></i>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-30 px-1">Address</label>
            <textarea 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full p-4 rounded-2xl border ${dividerColor} ${cardBg} text-sm font-bold ${primaryText} h-24 resize-none focus:border-[#4BA678] outline-none transition-all`}
              placeholder="Your Address"
            />
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving || name.length < 2}
          className="w-full py-5 rounded-full bg-[#4BA678] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all disabled:opacity-30"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;

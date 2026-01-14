
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageSettings: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('English');

  const languages = [
    { name: 'English', local: 'English' },
    { name: 'Bengali', local: 'বাংলা' },
    { name: 'Hindi', local: 'हिन्दी' }
  ];

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  return (
    <div className={`min-h-full flex flex-col transition-all duration-500 ${bgColor}`}>
      <div className={`sticky top-0 z-50 h-16 flex items-center gap-4 px-6 border-b ${dividerColor} ${cardBg}`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 flex items-center justify-start ${primaryText}`}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className={`text-lg font-bold ${primaryText}`}>Language</h1>
      </div>

      <div className="p-6 space-y-4">
        {languages.map((lang) => (
          <button 
            key={lang.name}
            onClick={() => setSelected(lang.name)}
            className={`w-full p-6 rounded-[32px] border ${dividerColor} ${cardBg} flex items-center justify-between transition-all active:scale-[0.98] ${selected === lang.name ? 'border-[#4BA678] ring-1 ring-[#4BA678]' : ''}`}
          >
            <div className="text-left">
              <p className={`text-sm font-bold ${primaryText}`}>{lang.name}</p>
              <p className="text-[10px] font-medium opacity-40">{lang.local}</p>
            </div>
            {selected === lang.name && (
              <div className="w-6 h-6 rounded-full bg-[#4BA678] flex items-center justify-center text-white">
                <i className="fa-solid fa-check text-[10px]"></i>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;

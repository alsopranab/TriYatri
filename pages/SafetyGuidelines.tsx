
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SafetyGuidelines: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const accentColor = 'text-[#4BA678]';

  const sections = [
    {
      title: "1. OUR SAFETY PHILOSOPHY",
      content: "TriYatri prioritizes human safety over convenience, local accountability over anonymity, and prevention over reaction. Every rule exists to protect Passengers, Riders, and the Dharmanagar community."
    },
    {
      title: "2. PASSENGER GUIDELINES",
      content: "Passengers must use verified numbers, provide emergency contacts, and be present at pickups. Crucially, capacity limits (max 6 for Autos) are strictly enforced to ensure safety."
    },
    {
      title: "3. RIDER GUIDELINES",
      content: "Riders undergo strict gatekeeping including ID and vehicle verification. For two-wheelers, helmets for both rider and passenger are non-negotiable. No helmet means no ride."
    },
    {
      title: "4. COMMUNICATION SAFETY",
      content: "In-app communication is for ride-related coordination only. Harassment or inappropriate messages result in immediate suspension. Logs are retained for safety monitoring."
    },
    {
      title: "5. CAPACITY & OVERLOADING",
      content: "Overloading vehicles is a major safety risk. Users will be prompted to book multiple vehicles or upgrade if capacity is exceeded. This protects vehicle stability and passenger life."
    },
    {
      title: "6. EMERGENCY PROTOCOLS",
      content: "During emergencies, live location data is shared with responders. Misuse of emergency features is taken seriously and may lead to permanent account restriction."
    }
  ];

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      <div className={`sticky top-0 z-50 p-6 pt-12 flex items-center gap-4 border-b border-black/5 backdrop-blur-xl ${cardBg}/80`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <i className="fa-solid fa-chevron-left text-sm opacity-60"></i>
        </button>
        <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>Safety Guidelines</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-8">
        <div className="space-y-2">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentColor}`}>Community Trust</p>
          <p className={`text-xs ${secondaryText}`}>Effective Date: February 2025</p>
        </div>

        <div className={`p-5 rounded-[28px] border-2 border-[#4BA678]/20 bg-[#4BA678]/5`}>
            <p className={`text-sm font-bold italic leading-relaxed ${primaryText}`}>
              "Safety is not optional. Trust is non-negotiable."
            </p>
        </div>

        <div className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className={`text-xs font-black uppercase tracking-widest ${primaryText}`}>{section.title}</h2>
              <p className={`text-sm leading-relaxed opacity-70 ${primaryText}`}>{section.content}</p>
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-[32px] border border-black/5 ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
          <h3 className={`text-sm font-bold mb-2 ${primaryText}`}>Emergency Response</h3>
          <p className={`text-xs leading-loose ${secondaryText}`}>
            If you feel unsafe during a ride, use the SOS button immediately. Our system connects to local emergency services and notifies your chosen contacts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;

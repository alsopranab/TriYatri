
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const accentColor = 'text-[#4BA678]';

  const sections = [
    {
      title: "1. WHO THIS POLICY APPLIES TO",
      content: "This policy applies to Passengers / Travellers who book rides, Riders / Drivers who provide transportation services, and anyone interacting with TriYatri through the app or related services."
    },
    {
      title: "2. INFORMATION WE COLLECT",
      content: "A. Information You Provide Directly: Names, mobile numbers, emergency contacts, and vehicle details for riders. B. Location Information: Real-time and background location data for matching, navigation, and safety. C. Device Information: Technical diagnostics and crash logs. D. Communication Data: Messages exchanged for safety monitoring."
    },
    {
      title: "3. HOW WE USE YOUR INFORMATION",
      content: "We use data for core services (ride matching), safety & trust (identity verification), platform improvement, and legal compliance."
    },
    {
      title: "4. DATA SHARING & DISCLOSURE",
      content: "We do not sell your personal data. Limited sharing occurs with other users (ride details), trusted service providers (maps, SMS), and legal authorities if required by law."
    },
    {
      title: "5. DATA RETENTION",
      content: "We retain data only as long as necessary for account management, ride history safety, and legal audit purposes."
    },
    {
      title: "6. USER RIGHTS & CONTROLS",
      content: "You have the right to access, correct, or request deletion of your personal data and account through the app."
    },
    {
      title: "7. SECURITY MEASURES",
      content: "We use secure servers, encrypted connections, and internal audits. While no system is 100% secure, we continuously improve safeguards."
    },
    {
      title: "8. EMERGENCY & SAFETY DATA USE",
      content: "In emergency situations, location and ride data may be shared with emergency responders and contacts to protect life and safety."
    },
    {
      title: "9. CHILDREN’S PRIVACY",
      content: "TriYatri services are not intended for children under 18. We do not knowingly collect data from minors."
    },
    {
      title: "10. RIDER-SPECIFIC PRIVACY NOTES",
      content: "Vehicle and document verification is mandatory. Safety compliance is reviewed periodically; violations may lead to removal."
    }
  ];

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-50 p-6 pt-12 flex items-center gap-4 border-b border-black/5 backdrop-blur-xl ${cardBg}/80`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <i className="fa-solid fa-chevron-left text-sm opacity-60"></i>
        </button>
        <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-8">
        <div className="space-y-2">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentColor}`}>TriYatri Legal</p>
          <p className={`text-xs ${secondaryText}`}>Last updated: February 2025</p>
        </div>

        <p className={`text-sm leading-relaxed ${primaryText}`}>
          TriYatri (“we”, “our”, “us”) is a local mobility platform built to provide safe, reliable transportation services for passengers and riders, with a strong focus on trust, safety, and accountability.
        </p>

        <div className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className={`text-xs font-black uppercase tracking-widest ${primaryText}`}>{section.title}</h2>
              <p className={`text-sm leading-relaxed opacity-70 ${primaryText}`}>{section.content}</p>
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-[32px] border border-black/5 ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
          <h3 className={`text-sm font-bold mb-2 ${primaryText}`}>Contact Information</h3>
          <p className={`text-xs leading-loose ${secondaryText}`}>
            TriYatri Support<br />
            Dharmanagar, Tripura<br />
            help.triyatri.com
          </p>
        </div>

        <div className="text-center pt-10">
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 ${primaryText}`}>
            Trust is Foundation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

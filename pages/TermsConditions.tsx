
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsConditions: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const accentColor = 'text-[#4BA678]';

  const sections = [
    { title: "1. INTRODUCTION", content: "Welcome to TriYatri. TriYatri is a local mobility and ride-booking platform that connects Passengers with Riders for transportation and emergency mobility services." },
    { title: "2. ELIGIBILITY", content: "You must be at least 18 years old, provide accurate information, and have the legal capacity to enter into a binding agreement." },
    { title: "3. ROLE DEFINITIONS", content: "Passenger/Traveller: A user who books rides. Rider/Driver: A verified individual providing transportation services using an approved vehicle." },
    { title: "4. SCOPE OF SERVICES", content: "TriYatri provides technology for ride requests, matching, and tracking. We do not operate vehicles; Riders are independent service providers." },
    { title: "5. ACCOUNT REGISTRATION", content: "Passengers require valid mobile OTP verification. Riders undergo strict verification including Aadhaar, address proof, and vehicle RC." },
    { title: "6. USER RESPONSIBILITIES", content: "Passengers must respect capacity limits and be on time. Riders must follow traffic laws and maintain vehicle safety standards." },
    { title: "7. CAPACITY & SAFETY", content: "Auto/E-Rickshaw maximum capacity is 6 passengers. Two-wheeler helmet compliance is mandatory. Safety violations may lead to account blocking." },
    { title: "8. CANCELLATION POLICY", content: "Passenger cancellations without valid reason may incur penalties. Penalties may be applied if a passenger is absent after the rider reaches pickup." },
    { title: "9. PAYMENTS & COMMISSION", content: "Fares are calculated based on distance, time, and vehicle type. TriYatri may deduct a modest, transparent commission from rider earnings." },
    { title: "10. EMERGENCY SERVICES", content: "Emergency features are for safety assistance. Misuse may result in account suspension. Location data may be shared with responders." },
    { title: "19. GOVERNING LAW", content: "These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Tripura, India." }
  ];

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      {/* Sticky Header */}
      <div className={`sticky top-0 z-50 p-6 pt-12 flex items-center gap-4 border-b border-black/5 backdrop-blur-xl ${cardBg}/80`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <i className="fa-solid fa-chevron-left text-sm opacity-60"></i>
        </button>
        <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>Terms & Conditions</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-40 space-y-8">
        <div className="space-y-2">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentColor}`}>TriYatri Legal</p>
          <p className={`text-xs ${secondaryText}`}>Effective Date: 13 January 2026</p>
        </div>

        <p className={`text-sm leading-relaxed ${primaryText}`}>
          By accessing or using the TriYatri mobile application, website, or related services (collectively, the “Platform”), you agree to be bound by these Terms & Conditions (“Terms”).
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
          <h3 className={`text-sm font-bold mb-2 ${primaryText}`}>Support & Legal Inquiries</h3>
          <p className={`text-xs leading-loose ${secondaryText}`}>
            TriYatri Support<br />
            help.triyatri.com<br />
            Dharmanagar, Tripura
          </p>
        </div>

        <div className="text-center pt-10">
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-30 ${primaryText}`}>
            Safety. Trust. Local.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;

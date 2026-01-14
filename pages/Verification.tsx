
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

interface VerificationProps {
  role: UserRole;
  isDarkMode: boolean;
}

const Verification: React.FC<VerificationProps> = ({ role, isDarkMode }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    emergencyContact: '',
    address: '',
    vehicleType: 'BIKE',
    vehicleRC: '',
  });

  const totalSteps = role === UserRole.RIDER ? 3 : 2;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final submission
      if (role === UserRole.RIDER) {
        // Show pending status for riders
        setStep(4); 
      } else {
        navigate('/');
      }
    }
  };

  const textColor = isDarkMode ? 'text-white' : 'text-[#1D1F3E]';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-slate-500';

  return (
    <div className={`min-h-full flex flex-col p-8 pb-32 transition-colors duration-500 ${isDarkMode ? 'bg-[#111226]' : 'bg-[#F4F5FA]'}`}>
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step > i ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300 opacity-30'}`}></div>
            ))}
          </div>
        </div>
        <h1 className={`text-2xl font-black ${textColor}`}>
          {step === 4 ? 'Application Sent' : role === UserRole.RIDER ? 'Rider Verification' : 'User Verification'}
        </h1>
        <p className={`text-sm mt-1 font-medium ${subTextColor}`}>
          {step === 4 ? 'Our team is reviewing your profile' : 'We ensure community trust and safety'}
        </p>
      </header>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Full Name (as per Aadhaar)</label>
            <div className="neumorphic-inset rounded-2xl p-4">
              <input 
                className="bg-transparent w-full focus:outline-none font-bold text-sm"
                placeholder="Ex: Sumit Debnath"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Email Address</label>
            <div className="neumorphic-inset rounded-2xl p-4">
              <input 
                type="email"
                className="bg-transparent w-full focus:outline-none font-bold text-sm"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Emergency Contact</label>
            <div className="neumorphic-inset rounded-2xl p-4">
              <input 
                type="tel"
                className="bg-transparent w-full focus:outline-none font-bold text-sm"
                placeholder="+91 XXXXX XXXXX"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Current Address</label>
            <div className="neumorphic-inset rounded-2xl p-4">
              <textarea 
                className="bg-transparent w-full focus:outline-none font-bold text-sm h-24 resize-none"
                placeholder="Enter your full address in Dharmanagar"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && role === UserRole.RIDER && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Vehicle Details</label>
            <div className="grid grid-cols-3 gap-3">
              {['BIKE', 'AUTO', 'CAR'].map(v => (
                <button 
                  key={v}
                  onClick={() => setFormData({...formData, vehicleType: v})}
                  className={`p-3 rounded-2xl border-2 transition-all font-bold text-[10px] ${formData.vehicleType === v ? 'border-indigo-600 bg-indigo-600/10 text-indigo-600' : 'border-transparent neumorphic-card'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${subTextColor}`}>Vehicle RC Number</label>
            <div className="neumorphic-inset rounded-2xl p-4">
              <input 
                className="bg-transparent w-full focus:outline-none font-bold text-sm uppercase"
                placeholder="TR 05 X XXXX"
                value={formData.vehicleRC}
                onChange={(e) => setFormData({...formData, vehicleRC: e.target.value})}
              />
            </div>
          </div>
          <div className={`p-4 rounded-2xl border border-dashed transition-colors ${isDarkMode ? 'border-white/10' : 'border-slate-300'}`}>
            <div className="flex items-center gap-3">
               <i className="fa-solid fa-helmet-safety text-orange-500"></i>
               <p className="text-[10px] font-bold">2 Helmets mandatory for two-wheelers</p>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
            <i className="fa-solid fa-clock-rotate-left text-4xl"></i>
          </div>
          <div className="space-y-2">
            <p className={`font-bold ${textColor}`}>Verification in progress</p>
            <p className="text-xs opacity-60">Usually reviewed within 24–48 hours. You will be notified once approved.</p>
          </div>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-sm shadow-xl">
            Return to Home
          </button>
        </div>
      )}

      {step < 4 && (
        <div className="mt-auto pt-8">
           <div className="flex items-center gap-2 mb-6 px-2">
              <i className="fa-solid fa-shield-halved text-indigo-500 text-xs"></i>
              <p className="text-[10px] opacity-40 font-medium">Your information is encrypted and used only for safety & verification.</p>
           </div>
           <button 
             onClick={handleNext}
             className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
           >
             {step === totalSteps ? 'Complete Verification' : 'Next Step'}
           </button>
        </div>
      )}
    </div>
  );
};

export default Verification;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRole, RideRequest } from '../types';

interface ReportIssueProps {
  isDarkMode: boolean;
  activeRide?: RideRequest | null;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ isDarkMode, activeRide }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(UserRole.TRAVELLER);
  const [step, setStep] = useState<'category' | 'details' | 'success'>('category');
  const [category, setCategory] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState<boolean | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('triyatri_user');
    if (user) {
      const parsed = JSON.parse(user);
      setRole(parsed.role);
    }
  }, []);

  const passengerCategories = [
    "Safety Concern",
    "Rider Behaviour",
    "Overcharging / Fare Issue",
    "Pickup or Drop Issue",
    "Ride Cancellation Issue",
    "Emergency Related",
    "App / Technical Issue",
    "Other"
  ];

  const riderCategories = [
    "Passenger Behaviour Issue",
    "Safety Concern",
    "Payment Issue",
    "False Cancellation / No-Show",
    "Vehicle or Capacity Issue",
    "App / Technical Issue",
    "Emergency Related",
    "Other"
  ];

  const categories = role === UserRole.RIDER ? riderCategories : passengerCategories;

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
    }, 1500);
  };

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const accentColor = isUrgent ? 'text-red-500' : 'text-[#4BA678]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  if (step === 'success') {
    return (
      <div className={`min-h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-700 ${bgColor}`}>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-[#4BA678]/10 text-[#4BA678]'}`}>
          <i className={`fa-solid ${isUrgent ? 'fa-shield-circle-exclamation' : 'fa-check-circle'} text-3xl`}></i>
        </div>
        <h2 className={`text-2xl font-bold tracking-tight mb-2 ${primaryText}`}>Report Submitted</h2>
        <p className={`text-sm leading-relaxed mb-10 ${secondaryText}`}>
          {isUrgent 
            ? "Our safety team has received your priority alert and will review the ride data immediately."
            : "Thank you for reporting. Your issue has been recorded for review by our support team."}
        </p>
        <button 
          onClick={() => navigate('/')}
          className={`w-full py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] text-white ${isUrgent ? 'bg-red-500' : 'bg-[#4BA678]'} shadow-xl`}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 p-6 pt-12 flex items-center gap-4 border-b ${dividerColor} backdrop-blur-xl ${cardBg}/80`}>
        <button onClick={() => step === 'details' ? setStep('category') : navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <i className="fa-solid fa-chevron-left text-sm opacity-60"></i>
        </button>
        <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>Report an Issue</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {step === 'category' && (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Context Notice */}
            <div className={`p-5 rounded-[28px] border ${dividerColor} ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 opacity-40 ${primaryText}`}>Context</p>
              <p className={`text-sm font-semibold ${primaryText}`}>
                {activeRide ? `Current Ride: ${activeRide.drop}` : "General / Recent Ride Issue"}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className={`px-2 text-[10px] font-black uppercase tracking-[0.2em] ${secondaryText}`}>What is the issue related to?</h3>
              <div className="grid gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setStep('details'); }}
                    className={`w-full p-5 rounded-[24px] border ${dividerColor} ${cardBg} flex items-center justify-between text-left active:scale-[0.98] transition-all`}
                  >
                    <span className={`text-sm font-medium ${primaryText}`}>{cat}</span>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-20"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Selected Category Chip */}
            <div className="flex items-center gap-2">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-white/60' : 'bg-slate-100 text-slate-500'}`}>
                {category}
              </span>
            </div>

            {/* Severity Check */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${secondaryText}`}>Is this issue urgent?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsUrgent(true)}
                  className={`p-4 rounded-[24px] border-2 flex flex-col items-center gap-3 transition-all ${isUrgent === true ? 'border-red-500 bg-red-500/5' : `border-transparent ${cardBg}`}`}
                >
                  <i className={`fa-solid fa-shield-halved text-xl ${isUrgent === true ? 'text-red-500' : 'opacity-20 ' + primaryText}`}></i>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isUrgent === true ? 'text-red-500' : secondaryText}`}>Yes, Safety Risk</span>
                </button>
                <button 
                  onClick={() => setIsUrgent(false)}
                  className={`p-4 rounded-[24px] border-2 flex flex-col items-center gap-3 transition-all ${isUrgent === false ? 'border-[#4BA678] bg-[#4BA678]/5' : `border-transparent ${cardBg}`}`}
                >
                  <i className={`fa-solid fa-circle-info text-xl ${isUrgent === false ? 'text-[#4BA678]' : 'opacity-20 ' + primaryText}`}></i>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isUrgent === false ? 'text-[#4BA678]' : secondaryText}`}>General Issue</span>
                </button>
              </div>
            </div>

            {isUrgent && (
              <div className={`p-4 rounded-[24px] bg-red-500/10 border border-red-500/20 animate-pulse`}>
                <p className="text-[11px] font-bold text-red-500 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  PRIORITY SAFETY MODE ACTIVE
                </p>
                <p className="text-[10px] text-red-500/70 mt-1">If you are in immediate danger, call local emergency services first.</p>
              </div>
            )}

            {/* Details Input */}
            <div className="space-y-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${secondaryText}`}>Describe what happened</h3>
              <div className={`p-5 rounded-[32px] border ${dividerColor} ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief summary of the issue..."
                  className={`w-full h-32 bg-transparent text-sm font-medium focus:outline-none resize-none ${primaryText}`}
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-4 opacity-30">
                    <button className="hover:opacity-100 transition-opacity"><i className="fa-solid fa-camera"></i></button>
                    <button className="hover:opacity-100 transition-opacity"><i className="fa-solid fa-microphone"></i></button>
                  </div>
                  <span className={`text-[10px] font-bold ${secondaryText}`}>{description.length}/500</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              disabled={!description || isUrgent === null || isSubmitting}
              onClick={handleSubmit}
              className={`w-full py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] text-white transition-all shadow-xl active:scale-[0.98] disabled:opacity-20 ${isUrgent ? 'bg-red-500' : 'bg-[#2D2D2D]'}`}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportIssue;

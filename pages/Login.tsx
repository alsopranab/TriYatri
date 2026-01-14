
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [step, setStep] = useState<'start' | 'phone' | 'otp' | 'role' | 'name'>('start');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']); 
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure the component is mounted before starting entry transitions
    const t = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(d => !d)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('role');
    }, 800);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setTimeout(() => setStep('name'), 400);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2 || !selectedRole) return;
    
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: fullName.trim(),
      phone: `+91 ${phone}`,
      role: selectedRole,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4BA678&color=fff`
    });
  };

  return (
    <div className={`min-h-full flex flex-col transition-opacity duration-1000 ${bgColor} ${isReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 px-8 flex flex-col justify-center">
        
        {step === 'start' && (
          <div className={`flex flex-col items-center transition-all duration-700 transform ${isReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className={`text-2xl font-bold tracking-tight mb-20 ${primaryText}`}>TriYatri</h1>
            <button 
              onClick={() => setStep('phone')} 
              className="w-full h-14 bg-[#4BA678] text-white rounded-full font-bold text-base shadow-lg shadow-[#4BA678]/20 active:scale-[0.98] transition-all"
            >
              Continue with Phone
            </button>
            <div className="mt-12 opacity-30">
              <p className={`text-[10px] font-bold uppercase tracking-[0.4em] ${primaryText}`}>Made with ❤️ in Dharmanagar</p>
            </div>
          </div>
        )}

        {step === 'phone' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8 text-center">
              <h2 className={`text-2xl font-bold ${primaryText}`}>Mobile Number</h2>
              <p className={`text-sm mt-2 ${secondaryText}`}>Verify your identity to continue</p>
            </div>
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className={`h-16 px-6 rounded-2xl flex items-center gap-4 border shadow-sm ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white'}`}>
                <span className={`text-lg font-bold opacity-30 ${primaryText}`}>+91</span>
                <input 
                  type="tel" 
                  autoFocus 
                  inputMode="numeric"
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  placeholder="00000 00000" 
                  className={`bg-transparent flex-1 text-xl font-bold focus:outline-none ${primaryText}`} 
                />
              </div>
              <button 
                disabled={phone.length < 10 || loading}
                className="w-full h-14 bg-[#4BA678] text-white rounded-full font-bold text-base shadow-lg active:scale-[0.98] transition-all disabled:opacity-30"
              >
                {loading ? 'Sending code...' : 'Continue'}
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-10 text-center">
              <h2 className={`text-2xl font-bold ${primaryText}`}>Verify your number</h2>
              <p className={`text-sm mt-2 ${secondaryText}`}>Enter the code sent to your phone</p>
            </div>
            <form onSubmit={handleOtpSubmit} className="space-y-12">
              <div className="flex justify-center gap-4">
                {otp.map((digit, i) => (
                  <input 
                    key={i} 
                    id={`otp-${i}`} 
                    type="text" 
                    maxLength={1} 
                    inputMode="numeric"
                    value={digit} 
                    onChange={(e) => handleOtpChange(i, e.target.value)} 
                    className={`w-14 h-16 rounded-2xl border text-center text-2xl font-bold focus:outline-none focus:ring-2 ring-[#4BA678]/30 transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-sm'} ${primaryText}`} 
                  />
                ))}
              </div>
              <button 
                disabled={otp.some(d => !d) || loading}
                className="w-full h-14 bg-[#4BA678] text-white rounded-full font-bold text-base shadow-lg active:scale-[0.98] transition-all"
              >
                Verify Code
              </button>
            </form>
          </div>
        )}

        {step === 'role' && (
          <div className="animate-in zoom-in-95 duration-500 h-full flex flex-col justify-center">
            <div className="mb-10 text-center">
              <h2 className={`text-2xl font-bold ${primaryText}`}>How will you use TriYatri?</h2>
              <p className={`text-sm mt-2 ${secondaryText}`}>Choose your primary mode of entry</p>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => handleRoleSelect(UserRole.TRAVELLER)} 
                className={`w-full p-8 rounded-[32px] border text-left flex items-center gap-6 transition-all ${cardBg} ${selectedRole === UserRole.TRAVELLER ? 'border-[#4BA678] bg-[#4BA678]/5' : 'border-black/5'}`}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#4BA678] bg-[#4BA678]/10">
                  <i className="fa-solid fa-person-walking text-2xl"></i>
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${primaryText}`}>Traveller</h4>
                  <p className={`text-xs opacity-40 ${primaryText}`}>I want to book rides</p>
                </div>
              </button>
              
              <button 
                onClick={() => handleRoleSelect(UserRole.RIDER)} 
                className={`w-full p-8 rounded-[32px] border text-left flex items-center gap-6 transition-all ${cardBg} ${selectedRole === UserRole.RIDER ? 'border-[#4BA678] bg-[#4BA678]/5' : 'border-black/5'}`}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[#4BA678] bg-[#4BA678]/10">
                  <i className="fa-solid fa-car text-2xl"></i>
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${primaryText}`}>Rider</h4>
                  <p className={`text-xs opacity-40 ${primaryText}`}>I want to provide rides</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 'name' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-10 text-center">
              <h2 className={`text-2xl font-bold ${primaryText}`}>What should we call you?</h2>
              <p className={`text-sm mt-2 ${secondaryText}`}>Required for safety & communication</p>
            </div>
            <form onSubmit={handleNameSubmit} className="space-y-8">
              <div className={`h-16 px-6 rounded-2xl flex items-center border shadow-sm ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white'}`}>
                <input 
                  autoFocus 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="Enter your name" 
                  className={`bg-transparent flex-1 text-lg font-bold focus:outline-none ${primaryText}`} 
                />
              </div>
              <button 
                disabled={fullName.trim().length < 2}
                className="w-full h-14 bg-[#4BA678] text-white rounded-full font-bold text-base shadow-lg active:scale-[0.98] transition-all disabled:opacity-30"
              >
                Continue
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;


import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RiderDocumentsProps {
  isDarkMode: boolean;
}

const RiderDocuments: React.FC<RiderDocumentsProps> = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const documents = [
    { 
      id: 'aadhaar', 
      name: 'Aadhaar Card', 
      status: 'Verified', 
      desc: 'Primary identity proof verified by local authorities.',
      icon: 'fa-id-card',
      color: 'text-green-500'
    },
    { 
      id: 'license', 
      name: 'Driving License', 
      status: 'Verified', 
      desc: 'Valid for Light Motor Vehicles (LMV).',
      icon: 'fa-address-card',
      color: 'text-green-500'
    },
    { 
      id: 'rc', 
      name: 'Vehicle RC', 
      status: 'Action Required', 
      desc: 'Vehicle registration is expiring in 12 days. Renew soon.',
      icon: 'fa-car-rear',
      color: 'text-amber-500'
    },
    { 
      id: 'insurance', 
      name: 'Insurance Policy', 
      status: 'Verified', 
      desc: 'Comprehensive coverage valid until Dec 2025.',
      icon: 'fa-shield-heart',
      color: 'text-green-500'
    }
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
        <h1 className={`text-lg font-bold ${primaryText}`}>Rider Documents</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="px-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Compliance Status</p>
        </div>

        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className={`p-6 rounded-[32px] border ${dividerColor} ${cardBg} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center ${doc.color}`}>
                    <i className={`fa-solid ${doc.icon}`}></i>
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${primaryText}`}>{doc.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Verified' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${doc.status === 'Verified' ? 'text-green-500' : 'text-amber-500'}`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center opacity-40">
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </button>
              </div>
              <p className="text-[10px] font-medium opacity-40 leading-relaxed px-1">
                {doc.desc}
              </p>
            </div>
          ))}
        </div>

        <div className={`p-6 rounded-[32px] border border-dashed ${dividerColor} bg-slate-100/30 dark:bg-white/5 flex flex-col items-center justify-center text-center gap-3`}>
            <div className="w-12 h-12 rounded-full bg-[#4BA678]/10 text-[#4BA678] flex items-center justify-center text-xl">
                <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div className="space-y-1">
                <h4 className={`text-xs font-bold ${primaryText}`}>Upload New Document</h4>
                <p className="text-[9px] font-medium opacity-30 uppercase tracking-widest">Max 5MB • PDF, JPG, PNG</p>
            </div>
        </div>

        <div className="pt-8 pb-10 text-center">
            <p className="text-[9px] font-medium opacity-30 leading-relaxed max-w-[240px] mx-auto">
                Documents are securely stored and used only for verification by the TriYatri Compliance Team in Dharmanagar.
            </p>
        </div>
      </div>
    </div>
  );
};

export default RiderDocuments;

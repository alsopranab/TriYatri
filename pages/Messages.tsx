
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MessageThread {
  id: string;
  riderName: string;
  rideType: string;
  context: string;
  lastMessage: string;
  time: string;
  status: 'On the way' | 'Arriving' | 'On trip' | 'Completed';
}

const MOCK_THREADS: MessageThread[] = [
  { id: '1', riderName: 'Deepak Debnath', rideType: 'Auto', context: 'Station → Kalibari', lastMessage: 'I am at the main gate parking.', time: '2 min ago', status: 'Arriving' }
];

const Messages: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (location.state?.openChatId) {
      const thread = MOCK_THREADS.find(t => t.id === location.state.openChatId);
      if (thread) setSelectedThread(thread);
    }
  }, [location]);

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white/90' : 'text-[#2D2D2D]';

  if (selectedThread) {
    return (
      <div className={`fixed inset-0 z-[120] flex flex-col ${bgColor}`}>
        <div className={`p-6 pt-12 flex items-center justify-between border-b border-black/5 ${cardBg}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5">
              <i className="fa-solid fa-chevron-left text-xs opacity-60"></i>
            </button>
            <div>
              <h2 className="text-base font-semibold">{selectedThread.riderName}</h2>
              <p className="text-[10px] font-bold text-[#4BA678] uppercase">{selectedThread.status}</p>
            </div>
          </div>
          <button onClick={() => window.location.href = 'tel:+919876543210'} className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-600 dark:bg-white/5">
            <i className="fa-solid fa-phone-volume text-xs"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col items-start max-w-[80%] space-y-1">
            <div className={`p-4 rounded-3xl rounded-tl-none ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'} text-sm`}>
              {selectedThread.lastMessage}
            </div>
            <span className="text-[9px] px-2 opacity-40">10:32 AM</span>
          </div>
        </div>

        <div className={`p-6 space-y-4 border-t border-black/5 ${cardBg}`}>
          <div className={`flex items-center gap-3 p-2 pl-5 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Message rider..." className="bg-transparent flex-1 text-sm outline-none" />
            <button className="w-10 h-10 rounded-full bg-[#4BA678] text-white flex items-center justify-center">
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full flex flex-col ${bgColor}`}>
      <div className="p-6 pt-12 border-b border-black/5">
        <h1 className="text-xl font-semibold">Coordination</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-40 space-y-3">
        {MOCK_THREADS.map(thread => (
          <div key={thread.id} onClick={() => setSelectedThread(thread)} className={`p-5 rounded-[28px] border border-black/5 ${cardBg} shadow-sm`}>
            <h4 className="text-sm font-bold">{thread.riderName}</h4>
            <p className="text-xs opacity-40 italic mt-2">"{thread.lastMessage}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;

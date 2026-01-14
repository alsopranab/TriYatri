
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyContacts: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: '', phone: '', relationship: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('triyatri_emergency_contacts');
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const saveContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem('triyatri_emergency_contacts', JSON.stringify(updated));
  };

  const handleSave = () => {
    if (!formData.name || formData.phone.length < 10) {
      setError('Provide valid name and phone.');
      return;
    }
    
    if (editingId) {
      const updated = contacts.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
      saveContacts(updated);
    } else {
      const newContact = { ...formData, id: Math.random().toString(36).substr(2, 9) };
      saveContacts([...contacts, newContact]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', relationship: '' });
    setIsAdding(false);
    setEditingId(null);
    setError('');
  };

  const startEdit = (c: Contact) => {
    setFormData({ name: c.name, phone: c.phone, relationship: c.relationship });
    setEditingId(c.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    saveContacts(updated);
    setShowDeleteConfirm(null);
  };

  const bgColor = isDarkMode ? 'bg-[#0F111A]' : 'bg-[#F4F6F4]';
  const cardBg = isDarkMode ? 'bg-[#1A1D29]' : 'bg-white';
  const primaryText = isDarkMode ? 'text-white' : 'text-[#2D2D2D]';
  const secondaryText = isDarkMode ? 'text-white/40' : 'text-[#6B7280]';
  const dividerColor = isDarkMode ? 'border-white/5' : 'border-black/5';

  return (
    <div className={`min-h-full flex flex-col transition-all duration-700 ${bgColor}`}>
      <div className={`p-6 pt-12 flex items-center gap-4 border-b ${dividerColor} ${cardBg}`}>
        <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          <i className="fa-solid fa-chevron-left text-sm opacity-60"></i>
        </button>
        <h1 className={`text-xl font-bold tracking-tight ${primaryText}`}>Emergency Contacts</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-32 space-y-6">
        <div className={`p-5 rounded-[28px] border ${dividerColor} ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
          <p className={`text-xs leading-relaxed ${secondaryText}`}>
            These contacts will be notified automatically with your live location if you trigger the SOS feature during a ride.
          </p>
        </div>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className={`p-5 rounded-[28px] border ${dividerColor} ${cardBg} flex items-center justify-between shadow-sm`}>
              <div>
                <h4 className={`text-sm font-bold ${primaryText}`}>{contact.name}</h4>
                <p className={`text-[10px] font-medium ${secondaryText}`}>{contact.phone} • {contact.relationship}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(contact)} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5">
                  <i className="fa-solid fa-pen text-[10px]"></i>
                </button>
                <button onClick={() => setShowDeleteConfirm(contact.id)} className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
                  <i className="fa-solid fa-trash text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {!isAdding && contacts.length < 5 && (
          <button onClick={() => setIsAdding(true)} className={`w-full py-5 rounded-[28px] border-2 border-dashed ${dividerColor} flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest ${secondaryText}`}>
            <i className="fa-solid fa-plus text-[10px]"></i> Add Contact
          </button>
        )}

        {isAdding && (
          <div className={`p-6 rounded-[32px] border ${dividerColor} ${cardBg} space-y-5 animate-in slide-in-from-bottom-4`}>
            <div className="space-y-4">
              <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full p-4 rounded-2xl border ${dividerColor} ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} text-sm font-bold ${primaryText}`} placeholder="Name" />
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className={`w-full p-4 rounded-2xl border ${dividerColor} ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} text-sm font-bold ${primaryText}`} placeholder="Phone Number" />
              <input value={formData.relationship} onChange={(e) => setFormData({...formData, relationship: e.target.value})} className={`w-full p-4 rounded-2xl border ${dividerColor} ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'} text-sm font-bold ${primaryText}`} placeholder="Relationship (e.g. Sister)" />
            </div>
            {error && <p className="text-red-500 text-[10px] text-center font-bold">{error}</p>}
            <div className="flex gap-3">
              <button onClick={resetForm} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase">Cancel</button>
              <button onClick={handleSave} className="flex-[2] py-4 rounded-2xl bg-[#4BA678] text-white text-[10px] font-black uppercase tracking-widest">Save</button>
            </div>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-8 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className={`w-full max-w-sm p-8 rounded-[40px] shadow-2xl space-y-6 ${cardBg} text-center`}>
            <h3 className={`text-xl font-bold ${primaryText}`}>Remove Contact?</h3>
            <div className="grid gap-3">
               <button onClick={() => handleDelete(showDeleteConfirm)} className="w-full py-4 bg-red-500 text-white rounded-full font-bold text-xs uppercase">Remove</button>
               <button onClick={() => setShowDeleteConfirm(null)} className="w-full py-4 opacity-40 font-bold text-xs uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;


import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import RiderHome from './pages/RiderHome';
import MyRides from './pages/MyRides';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import RideConfirmation from './pages/RideConfirmation';
import LiveTracker from './pages/LiveTracker';
import LiveTrip from './pages/LiveTrip';
import RideCompletion from './pages/RideCompletion';
import Login from './pages/Login';
import Splash from './pages/Splash';
import EmergencyContacts from './pages/EmergencyContacts';
import SafetyGuidelines from './pages/SafetyGuidelines';
import ReportIssue from './pages/ReportIssue';
import EditProfile from './pages/EditProfile';
import LanguageSettings from './pages/LanguageSettings';
import NotificationSettings from './pages/NotificationSettings';
import RiderDocuments from './pages/RiderDocuments';
import RiderNavigation from './pages/RiderNavigation';
import PickupConfirmation from './pages/PickupConfirmation';
import RiderTripSummary from './pages/RiderTripSummary';
import { RideRequest, User, UserRole, RideStatus } from './types';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeRide, setActiveRideState] = useState<any | null>(null);
  const [acceptedRequest, setAcceptedRequest] = useState<any | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const setActiveRide = (ride: any | null) => {
    setActiveRideState(ride);
    if (ride) localStorage.setItem('triyatri_active_ride', JSON.stringify(ride));
    else localStorage.removeItem('triyatri_active_ride');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('triyatri_user');
    const storedRide = localStorage.getItem('triyatri_active_ride');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    if (storedRide) setActiveRideState(JSON.parse(storedRide));
  }, []);

  const handleLogin = (userData: User) => {
    localStorage.setItem('triyatri_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('triyatri_user');
    localStorage.removeItem('triyatri_active_ride');
    setUser(null);
    setIsAuthenticated(false);
    setActiveRideState(null);
    setAcceptedRequest(null);
    navigate('/login');
  };

  if (showSplash) return <Splash onFinish={() => setShowSplash(false)} />;

  const isRiderMode = user?.role === UserRole.RIDER;
  const isAuthPage = location.pathname === '/login';

  return (
    <LanguageContext.Provider value={{ language: 'en', setLanguage: () => {}, t: (k) => k }}>
      <div className={`max-w-md mx-auto h-screen relative flex flex-col shadow-2xl overflow-hidden transition-colors duration-400 ease-in-out ${isDarkMode ? 'bg-[#0F111A] text-white' : 'bg-[#F4F6F4] text-[#2D2D2D]'}`}>
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} isDarkMode={isDarkMode} />} />
            
            <Route path="/" element={
              isAuthenticated ? (
                isRiderMode ? (
                  acceptedRequest ? <Navigate to="/rider-nav" /> : <RiderHome isDarkMode={isDarkMode} user={user} onAccept={(req) => { setAcceptedRequest(req); navigate('/rider-nav'); }} />
                ) : <Home setActiveRide={setActiveRide} activeRide={activeRide} isDarkMode={isDarkMode} user={user} />
              ) : <Navigate to="/login" />
            } />

            {/* Rider Specific Flow */}
            <Route path="/rider-nav" element={
              isRiderMode && acceptedRequest ? (
                <RiderNavigation 
                  isDarkMode={isDarkMode} 
                  user={user} 
                  activeRide={acceptedRequest} 
                  onReachedPickup={() => navigate('/pickup-confirm')} 
                />
              ) : <Navigate to="/" />
            } />
            <Route path="/pickup-confirm" element={
              isRiderMode && acceptedRequest ? (
                <PickupConfirmation 
                  isDarkMode={isDarkMode} 
                  user={user} 
                  activeRide={acceptedRequest} 
                  onStartRide={() => navigate('/trip')} 
                />
              ) : <Navigate to="/" />
            } />
            <Route path="/rider-summary" element={
              isRiderMode ? (
                <RiderTripSummary 
                  isDarkMode={isDarkMode} 
                  user={user} 
                  activeRide={acceptedRequest} 
                />
              ) : <Navigate to="/" />
            } />

            <Route path="/rides" element={<MyRides activeRide={activeRide} isDarkMode={isDarkMode} />} />
            <Route path="/messages" element={<Messages isDarkMode={isDarkMode} />} />
            <Route path="/profile" element={<Profile isDarkMode={isDarkMode} user={user} onUpdateUser={setUser} onLogout={handleLogout} toggleTheme={() => setIsDarkMode(!isDarkMode)} />} />
            
            <Route path="/profile/edit" element={<EditProfile isDarkMode={isDarkMode} user={user} onUpdateUser={setUser} />} />
            <Route path="/profile/language" element={<LanguageSettings isDarkMode={isDarkMode} />} />
            <Route path="/profile/notifications" element={<NotificationSettings isDarkMode={isDarkMode} />} />
            <Route path="/profile/documents" element={<RiderDocuments isDarkMode={isDarkMode} />} />

            <Route path="/emergency-contacts" element={<EmergencyContacts isDarkMode={isDarkMode} />} />
            <Route path="/safety" element={<SafetyGuidelines isDarkMode={isDarkMode} />} />
            <Route path="/report" element={<ReportIssue isDarkMode={isDarkMode} activeRide={activeRide} />} />

            <Route path="/confirm" element={<RideConfirmation ride={activeRide} isDarkMode={isDarkMode} setActiveRide={setActiveRide} />} />
            <Route path="/tracker" element={<LiveTracker ride={activeRide} isDarkMode={isDarkMode} />} />
            <Route path="/trip" element={<LiveTrip ride={activeRide || acceptedRequest} isDarkMode={isDarkMode} />} />
            <Route path="/completion" element={<RideCompletion ride={activeRide} isDarkMode={isDarkMode} onDone={() => setActiveRide(null)} />} />
          </Routes>
        </div>
        {!isAuthPage && isAuthenticated && <Navigation isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} isRiderMode={isRiderMode} />}
      </div>
    </LanguageContext.Provider>
  );
};

export default App;

import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Login from './components/Login';
import NurseDashboard from './components/NurseDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import Register from './components/Register';
import AppointmentForm from './components/AppointmentForm';
import AboutUs from './components/AboutUs';

function App() {
  const [page, setPage] = useState('home'); // 'home', 'login', 'nurse', 'doctor', 'register', 'appointment', 'about'
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
    setPage(user.role === 'nurse' ? 'nurse' : 'doctor');
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  if (page === 'home') {
    return (
      <HomePage 
        onLogin={() => setPage('login')} 
        onAbout={() => setPage('about')}
        onAppointment={() => setPage('appointment')}
      />
    );
  }

  if (page === 'about') {
    return <AboutUs onHome={() => setPage('home')} />;
  }

  if (page === 'login') {
    return (
      <Login onLogin={handleLogin} onRegister={() => setPage('register')} />
    );
  }

  if (page === 'register') {
    return <Register onRegister={() => setPage('home')} onBack={() => setPage('login')} />;
  }

  if (page === 'appointment') {
    return <AppointmentForm onBack={() => setPage('home')} onSuccess={() => setPage('home')} />;
  }

  if (page === 'nurse') {
    return <NurseDashboard onLogout={handleLogout} user={user} />;
  }

  if (page === 'doctor') {
    return <DoctorDashboard onLogout={handleLogout} user={user} />;
  }

  return null;
}

export default App;

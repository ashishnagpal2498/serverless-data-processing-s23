// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import SecurityQuestions from './components/SecurityQuestions';
import CipherComponent from './components/CipherComponent';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/security-questions" element={<SecurityQuestions />} />
            <Route path="/cipher-challenge" element={<CipherComponent />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

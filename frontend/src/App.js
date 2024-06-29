import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Signup from './components/Signup';
import SecurityQuestions from './components/SecurityQuestions';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/security-questions" element={<SecurityQuestions />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

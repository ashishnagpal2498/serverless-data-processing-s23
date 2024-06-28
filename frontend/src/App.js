import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

const App = () => {
  return (
     <Router>
      <div>
        <Navbar />
     <Routes>
         <Route path="/" exact element={<Home/>} />
     </Routes>
     </div>
 </Router>
  );
}

export default App;

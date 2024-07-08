// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cognitoRedirectUri } from '../config';
const Navbar = () => {
  const { auth, logout } = useAuth();

  const routeChange = () => {
    window.location.href = '/preview.html'; // This assumes that preview.html is in the public directory
  };

  return (
    <nav className="bg-yellow-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white text-lg font-bold">
            Home
          </Link>
          <Link to="/properties" className="text-white text-lg font-bold ml-3">
            Properties
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!auth.isAuthenticated ? (
            <>
              <Link className='text-white' to={`https://dal-vacation-home-sdp23.auth.us-east-1.amazoncognito.com/login?client_id=hobfr7l22dpek04qvj53pvuhv&response_type=code&scope=email+openid+phone&redirect_uri=${cognitoRedirectUri}`}>Login</Link>
              <Link to="/signup" className="text-white">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="text-white">Hello, {auth.user}</span>

              <a href="/preview.html" className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">Notifications</a>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
              >
                
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

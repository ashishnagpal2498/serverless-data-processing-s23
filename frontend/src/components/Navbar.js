// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-white text-lg font-bold">
            Home
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {!auth.isAuthenticated ? (
            <>
              <Link className='text-white' to="https://dalhome-ashish-2.auth.us-east-1.amazoncognito.com/login?client_id=1av1ucnjabrp4eg42a7e68mna1&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsecurity-questions">Login</Link>
              <Link to="/signup" className="text-white">
                Signup
              </Link>
            </>
          ) : (
            <>
              <span className="text-white">Hello, {auth.user}</span>
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

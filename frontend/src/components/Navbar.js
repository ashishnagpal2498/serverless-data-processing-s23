import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="https://dalhome-ashish-2.auth.us-east-1.amazoncognito.com/login?client_id=1av1ucnjabrp4eg42a7e68mna1&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

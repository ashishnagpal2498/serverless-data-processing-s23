import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="https://dal-vacation-home-sdp-23.auth.us-east-1.amazoncognito.com/login?client_id=725u7ia0f8eq2al4lhccq8l48r&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">Login</Link></li>
        <li><Link to="https://dal-vacation-home-sdp-23.auth.us-east-1.amazoncognito.com/signup?client_id=725u7ia0f8eq2al4lhccq8l48r&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F">Signup</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();

    const poolData = {
      UserPoolId: 'us-east-1_XBgQX78yQ',
      ClientId: '1av1ucnjabrp4eg42a7e68mna1'
    };

    const userPool = new CognitoUserPool(poolData);

    const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
      ];

    userPool.signUp(email, password,attributeList, null, async (err, result) => {
      if (err) {
        setError(err.message || JSON.stringify(err));
        return;
      }

      const cognitoUser = result.user;
      console.log(cognitoUser)
    //   console.log('user name is ' + cognitoUser.getemail());

      // Store additional user details in DynamoDB
      try {

        await axios.post('https://fd3qubgkmwyfgwy5gniufc2wlq0gxcxw.lambda-url.us-east-1.on.aws/', { username:email });

        await axios.post('https://wapckgn3fjjhoecpbjx7bcedpq0oouzl.lambda-url.us-east-1.on.aws/', {
          username: email,
          address,
          phone
        });

        setSuccess('User signed up and details stored successfully!');
      } catch (error) {
        console.error('Error storing user details', error);
        setError('Failed to store user details. Please try again.');
      }
    });
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSignup}>
        <label>
          Email:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Address:
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>
          Phone:
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

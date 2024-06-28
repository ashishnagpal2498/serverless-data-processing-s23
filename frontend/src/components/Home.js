import React, { useEffect, useState } from 'react';
import axios from 'axios'
const Home = () => {
    const [error, setError] = useState(null);

    useEffect(()=> {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        async function fetchToken(){
          const clientId = '1av1ucnjabrp4eg42a7e68mna1';
          const redirectUri = 'http://localhost:3000/';
          const domain = 'dalhome-ashish-2';
    
          const tokenEndpoint = `https://${domain}.auth.us-east-1.amazoncognito.com/oauth2/token`;
    
          const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };
    
          const data = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            code: code,
            redirect_uri: redirectUri,
          })
          try{

        const response =  await axios.post(tokenEndpoint, data, { headers })
        
              const { access_token, id_token, refresh_token } = response.data;
              localStorage.setItem('accessToken', access_token);
              localStorage.setItem('idToken', id_token);
              localStorage.setItem('refreshToken', refresh_token);
            //   window.location.href = '/'; // Redirect to home or any other page
            console.log(access_token)
        }
        catch(error){
            console.error('Error exchanging code for tokens', error);
            setError('Failed to log in. Please try again.');
          };

    }
    if(code) 
        fetchToken();
    },[])

  return (
    <div>
      <h1>Welcome to the Home Vaction Application</h1>
    </div>
  );
};

export default Home;

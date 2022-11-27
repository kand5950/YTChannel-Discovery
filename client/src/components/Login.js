import React from 'react';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

export default function Login(props) {
  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log('Encoded JWT ID token: ' + response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById('signInDiv').hidden = true;
  }

  function handleSignout(event) {
    setUser({});
    document.getElementById('signInDiv').hidden = false;
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        '730391860568-5bqmr300dku394cucpfeeemcp6en9jp6.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <ul>
      <div id="signInDiv"></div>

      {user && (
        <div>
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
        </div>
      )}

      {Object.keys(user).length != 0 && (
        <button onClick={(e) => handleSignout(e)}>Sign Out</button>
      )}
    </ul>
  );
}

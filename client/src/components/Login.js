import React from 'react';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const CLIENT_ID =
  '730391860568-5bqmr300dku394cucpfeeemcp6en9jp6.apps.googleusercontent.com';

const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const API_KEY = 'AIzaSyBBji4bbd0CFN2rA65wqMFbicgZ0H1jbSI';

export default function Login(props) {
  const [user, setUser] = useState({});
  const [tokenClient, setTokenClient] = useState({});

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

  function createDriveFile() {
    tokenClient.requestAccessToken();
  }
  useEffect(() => {
    /* global google */
    const google = window.google;
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
    });

    // tokenClient
    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log(tokenResponse);

          if (tokenResponse && tokenResponse.access_token) {
            axios
              .get(
                `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet%2CcontentDetails&mine=true&key=${API_KEY} HTTP/1.1`,
                {
                  headers: {
                    'Authorization': `Bearer ${tokenResponse.access_token}`,
                    'Accept': 'application/json',
                  },
                }
              )
              .then((response) => console.log(response.data.items));
          }
        },
      })
    );

    // tokenClient.requestAccessToken();

    google.accounts.id.prompt();
  }, []);

  return (
    <ul>
      <div id="signInDiv"></div>

      {user && (
        <div>
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
          <input type="submit" onClick={createDriveFile} value="Sub list" />
        </div>
      )}

      {Object.keys(user).length != 0 && (
        <button onClick={(e) => handleSignout(e)}>Sign Out</button>
      )}
    </ul>
  );
}

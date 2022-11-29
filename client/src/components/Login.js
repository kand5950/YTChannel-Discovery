import React from 'react';
import { useState } from 'react';

import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

export default function Login(props) {
  const [auth, setAuth] = useState(null);

  const handleCallbackResponse = (response) => {
    setAuth(response.access_token);
  };

  const google = window.google;
  let client = google.accounts.oauth2.initTokenClient({
    scope: SCOPES,
    client_id: CLIENT_ID,
    ux_mode: 'popup',
    callback: handleCallbackResponse,
  });
  const doAuth = () => {
    const getCode = () => {
      client.requestAccessToken();
    };
    getCode();
  };
  const getSubscriptions = () => {
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=200&access_token=${auth}`
      )
      .then((data) => {
        console.log(data.data.items);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      hello
      <button onClick={doAuth}>AUTH</button>
      <button onClick={getSubscriptions}>SUBS</button>
    </div>
  );
}

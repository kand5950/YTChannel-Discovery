import React from 'react';
import { useState } from 'react';

import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

export default function Login(props) {
  const [auth, setAuth] = useState(null);
  const [subs, setSubs] = useState(null);
  const [subsChannels, setSubsChannels] = useState(null);

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
        setSubs(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRecommendedChannels = (item) => {
    const subsResourceID = item.snippet.resourceId.channelId;
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/channelSections?part=snippet%2CcontentDetails&channelId=${subsResourceID}&maxResults=200&access_token=${auth}`
      )
      .then((data) => {
        data.data.items.forEach((element) => {
          if (element.snippet.type === 'multiplechannels') {
            setSubsChannels(element.contentDetails.channels);
          }
        });
      });
  };

  const clickHandler = (item) => {
    getRecommendedChannels(item);
  };

  return (
    <div className="App">
      hello
      <button onClick={doAuth}>AUTH</button>
      <button onClick={getSubscriptions}>SUBS</button>
      <ul>
        {subs &&
          subs.items.map((item) => {
            return (
              <>
                <li>
                  <h2>{item.snippet.title}</h2>
                  <img src={item.snippet.thumbnails.default.url} alt=""></img>
                  <p>{item.snippet.description}</p>
                </li>
                <button onClick={() => clickHandler(item)}>Recommended!</button>
              </>
            );
          })}
      </ul>
    </div>
  );
}

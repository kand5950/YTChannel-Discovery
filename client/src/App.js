import { useEffect } from 'react';
import jwt_decode from "jwt-decode";
import './App.css';

function App() {

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "730391860568-5bqmr300dku394cucpfeeemcp6en9jp6.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return <div className="App">
    <div id="signInDiv"></div>
  </div>;
}

export default App;

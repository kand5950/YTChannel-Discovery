import './App.css';
import Login from './components/Login';

function App() {
  // If we have no user show sign in button and vise versa.
  return (
    <div className="App">
      <Login></Login>
    </div>
  );
}

export default App;

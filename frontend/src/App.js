import './App.css';
import Home from './containers/Home/Home';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <Home />
      </AuthProvider>
    </div>
  );
}

export default App;

import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login'
import { Dashboard } from './pages/dashboard'
import { SignUp } from './pages/signUp'
import { Profile } from './pages/profile'

function App() {
  useEffect(() => {
    document.title = 'Instagram';
  }, []);

  return (
    // Set up routing for your application using React Router
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

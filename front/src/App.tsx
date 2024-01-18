import { Route, Routes } from 'react-router-dom';
import Login from './components/LoginPage';
import Register from './components/RegisterPage';
import NotFound from './components/NotFound';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Footer from './components/Footer';
import Game from './components/Game';
import { SocketProvider } from './contexts/socketContext';
import { SessionProvider } from './contexts/sessionContext';
import { UserProvider } from './contexts/userContext';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Profile from './components/Profile';
import Quiz from './components/Quiz';
import Dashboard from './pages/dashboard/Dashboard';
import Example from './components/Dummy';

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
        <SessionProvider>
          <SocketProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/logout" element={<NotFound />}/>
                <Route path="/game/:roomKey" element={<Game />}/>
                <Route path="/test" element={<Example />}/>
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route path="" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="quiz" element={<Quiz />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </UserProvider>
          </SocketProvider>
        </SessionProvider>
      <Footer />
    </>
  );
}

export default App;

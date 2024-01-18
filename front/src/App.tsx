import { createBrowserRouter, RouterProvider, Route, Routes } from 'react-router-dom';
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
import HomeSkeleton  from "./components/AppSkeleton"
import Dashboard from './components/Dashboard';

/*
const router = Routes([
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/logout',
    element: <NotFound />,
  },
  {
    path: '/game/:roomKey',
    element: <Game />,
  },
  {
    path: '/test',
    element: <HomeSkeleton />
  },
]);
*/

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
        <SessionProvider>
          <SocketProvider>
            <UserProvider>
              <Routes>
                <Route path="/" element={<Home />} errorElement={<NotFound />}/>
                <Route path="/login" element={<Login />} errorElement={<NotFound />}/>
                <Route path="/register" element={<Register />} errorElement={<NotFound />}/>
                <Route path="/logout" element={<NotFound />} errorElement={<NotFound />}/>
                <Route path="/game/:roomKey" element={<Game />} errorElement={<NotFound />}/>
                <Route path="/test" element={<HomeSkeleton />} errorElement={<NotFound />}/>
                <Route path="/dashboard" element={<Dashboard />} />
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

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Footer from './components/Footer';
import Game from './components/Game';
import { SocketProvider } from './contexts/socketContext';
import { SessionProvider } from './contexts/sessionContext';
import HomeSkeleton  from "./components/AppSkeleton"

const router = createBrowserRouter([
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

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
        <SessionProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </SessionProvider>
      <Footer />
    </>
  );
}

export default App;

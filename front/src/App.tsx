import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Footer from './components/Footer';

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
]);

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <RouterProvider router={router} />

      <Footer />
    </>
  );
}

export default App;

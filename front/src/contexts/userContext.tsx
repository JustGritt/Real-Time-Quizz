import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import type { UserData } from './socketContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api'

interface UserContextProps {
  loggedIn: boolean;
  userData: UserData;
  Login: (email: string, password: string) => void;
  Logout: () => void;
  Register: (email: string, display_name: string, password: string) => void;
}

export const UserContext = createContext({} as UserContextProps);

export const UserProvider = ({ children }: any) => {

  const [userData, setUserData] = useState({} as UserData);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  function Login(email: string, password: string) {
    axios.post(`${API_URL}/login`, { email, password })
      .then(loginResponse => {
        const { data } = loginResponse;
        if (data.auth === true) {
          axios.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
          axios.get(`${API_URL}/me`)
            .then(meResponse => {
              const myuser = { ...meResponse.data, accessToken: data.accessToken };
              setUserData(myuser);
              localStorage.setItem('user', JSON.stringify(myuser));
              setLoggedIn(true);
              toast.success('Logged in successfully!');
              setTimeout(() => {
                navigate('/');
              }, 600);
            })
            .catch(meError => {
              console.error(`Me Error: ${meError}`);
            });
        } else {
          console.log(data.message);
        }
      })
      .catch(loginError => {
        console.error(`Login Error: ${loginError}`);
      });
  }

  function Logout() {
    setUserData({} as UserData);
    setLoggedIn(false);
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 600);
  }

  function Register(email: string, display_name: string, password: string) {
    axios
      .post(`${API_URL}/register`, { email, display_name, password })
      .then(res => {
        if (res.data) {
          toast.success('Registered successfully!');
          setTimeout(() => {
            navigate('/');
          }, 300);
        }
      })
      .catch(e => {
        console.log(`Register Error: ${e}`);
        toast.error('Error creating account, please try again.');
      });
  }

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        userData,
        Login,
        Logout,
        Register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

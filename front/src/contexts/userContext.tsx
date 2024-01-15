import { createContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api'
export const UserContext = createContext({} as any);

export const UserProvider = ({ children }: any) => {
  interface User {
    id: number;
    email: string;
    display_name: string;
    socketId: string;
    accessToken?: string;
    host?: string;
    roomKey?: string;
  }

  const [userData, setUserData] = useState({} as any);
  const [loggedIn, setLoggedIn] = useState(false);

  function Login(email: string, password: string) {
    axios
      .post(`${API_URL}/login`, { email, password })
      .then(res => {
        console.log(res.data);
        if (res.data.auth === true) {
          console.log(res.data);
          setUserData(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          setLoggedIn(true);
          toast.success('Logged in successfully!');
        } else {
          console.log(res.data.message);
        }
      })
      .catch(e => {
        console.log(`Login Error: ${e}`);
      });
  }

  function Logout() {
    axios
      .post(`${API_URL}/logout`, {
        userID: userData.id,
      })
      .then(res => {
        if (res.data.success === false) {
          console.log(res.data.message);
        }
        setUserData({} as User);
        setLoggedIn(false);
      })
      .catch(e => {
        console.log(`Login Error: ${e}`);
      });
  }

  function Register(email: string, display_name: string, password: string) {
    axios
      .post(`${API_URL}/register`, { email, display_name, password })
      .then(res => {
        if (res.data.success === true) {
          setUserData(res.data.user);
          setLoggedIn(true);
        } else {
          console.log(res.data.message);
        }
      })
      .catch(e => {
        console.log(`Registration Error: ${e}`);
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

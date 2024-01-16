import { createContext, useEffect, useContext, ReactNode, useState } from 'react';
import socket from '../libs/socket';
import { SessionContext } from './sessionContext';
import HomeSkeleton from '../components/AppSkeleton';

interface SocketProviderProps {
  children: ReactNode;
}

interface UserData {
  id: string;
  socketId?: string;
  accessToken?: string;
  email: string;
  display_name: string;
}

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

export const SocketContext =  createContext<{ user: UserData | null; loading: boolean }>({ user: null, loading: false });

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { GetConnectedUsers } = useContext(SessionContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const TryConnect = () => {
      const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUserData.id) {
        Setup(storedUserData);
      } else {
        console.log('No stored user data found.');
        setLoading(false);
      }
    };

    const Setup = (storedUserData: UserData) => {
      if (!socket) return;

      socket.on('connect', () => {
        /*
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedUserData.accessToken}`;

        axios.post(`${API_URL}/users/usersocketid`, {
          userId: storedUserData.id,
          socket_id: socket.id,
        })
        .then(res => {
          console.log(res.data, 'res.data');
          if (res.data) {
            setUser({ ...res.data[0], accessToken: storedUserData.accessToken });
            localStorage.setItem('user', JSON.stringify({ ...res.data[0], accessToken: storedUserData.accessToken }));
            console.log('Successfully updated the socketid.');
          } else {
            console.log('Failed To Connect.');
            socket.disconnect();
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
        */
        console.log('Successfully updated the socketid.');
        setUser({ ...storedUserData, socketId: socket.id });
        localStorage.setItem('user', JSON.stringify({ ...storedUserData, socketId: socket.id }));
        setLoading(false);

      });

      socket.on('close', () => {
        console.log('Socket Connection Terminated.');
        socket.disconnect();
      });

      socket.on('user-join', (res: any) => {
        console.log(`${res.name} joined your game.`);
        GetConnectedUsers(res.key);
      });

      socket.on('user-leave', res => {
        console.log(`${res.name} left your game.`);
        GetConnectedUsers(res.key);
      });
    };

    TryConnect();
  }, []); // No dependencies, runs once on mount

  
  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <SocketContext.Provider value={{  user, loading }}>
      {children}
    </SocketContext.Provider>
  );
};


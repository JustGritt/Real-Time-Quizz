import { createContext, useEffect, useContext, ReactNode, useState } from 'react';
import socket from '../libs/socket';
import { SessionContext } from './sessionContext';
import HomeSkeleton from '../components/AppSkeleton';

interface SocketProviderProps {
  children: ReactNode;
}

export type UserData = {
  id: number;
  socketId?: string;
  accessToken?: string;
  email: string;
  display_name: string;
}

export const SocketContext =  createContext<{ user: UserData | null; loading: boolean }>({ user: null, loading: true });

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
        console.log('Socket Connection Established.');
        setUser({ ...storedUserData, socketId: socket.id });
        localStorage.setItem('user', JSON.stringify({ ...storedUserData, socketId: socket.id }));
        setLoading(false);
      });

      socket.on('close', () => {
        console.log('Socket Connection Terminated.');
        socket.disconnect();
      });

      socket.on('user-join', (res: any) => {
        console.log(`${res.display_name} joined your game.`);
        GetConnectedUsers(res.key);
      });

      socket.on('user-leave', res => {
        console.log(`${res.display_name} left your game.`);
        GetConnectedUsers(res.key);
      });
    };

    TryConnect();

  }, []); // No dependencies, runs once on mount

  /*
  if (loading) {
    return <HomeSkeleton />;
  }
  */

  return (
    <SocketContext.Provider value={{  user, loading }}>
      {children}
    </SocketContext.Provider>
  );
};


import { createContext, useEffect, useContext, ReactNode, useState } from 'react';
import socket from '../libs/socket';
import { SessionContext } from './sessionContext';
import HomeSkeleton from '../components/AppSkeleton';
import toast from 'react-hot-toast';
import { json } from 'react-router-dom';

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

export type Message = {
  message: string;
  display_name: string;
}


export const SocketContext =  createContext<{ user: UserData | null; loading: boolean; chatMessages: Message[]; sendMessage: any; setchatMessages: any}>({ user: null, loading: true, chatMessages: [], sendMessage: null, setchatMessages: null });

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { GetConnectedUsers } = useContext(SessionContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setchatMessages] = useState<Message[]>([]);

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

      socket.on('game-chat', res => {
        setchatMessages((prevMessages) => [...prevMessages, res])
        console.log(`${chatMessages} sent a message.`);
        toast.success(`${res.message}: ${res.display_name}`);
      });
    };

    TryConnect();

    return () => {
      socket.off('connect');
      socket.off('close');
      socket.off('user-join');
      socket.off('user-leave');
      socket.off('game-chat');
    }
  }, []); // No dependencies, runs once on mount


   const sendMessage = (message: string, roomKey: string, user: UserData) => {
    if (socket) {
      const name = user.display_name;
      //send message to the perticular room
      socket.emit('game-chat', { message, roomKey, name });
    }
  };

  /*
  if (loading) {
    return <HomeSkeleton />;
  }
  */
  
  

  return (
    <SocketContext.Provider value={{ user, loading, sendMessage, chatMessages, setchatMessages }}>
      {children}
    </SocketContext.Provider>
  );
};


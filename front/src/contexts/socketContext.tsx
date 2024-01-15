import { createContext, useEffect, useContext } from 'react';
import axios from 'axios';
import socket from '../libs/socket';
import { SessionContext } from './sessionContext';

interface UserData {
  id: string;
  accessToken: string;
  socketId: string;
}

const API_URL = 'http://localhost:8080/api';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }: any) => {
  const { GetConnectedUsers } = useContext(SessionContext);

  useEffect(() => {
    const TryConnect = () => {
      console.log(`Attempting to connect...`);
      const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUserData.id) {
        Setup(storedUserData);
      }
    };

    const Setup = (storedUserData: UserData) => {
      if (!socket) return;

      socket.on('connect', () => {
        setTimeout(() => {
          axios.defaults.headers.common['Authorization'] =
            `Bearer ${storedUserData.accessToken}`;
          axios
            .post(`${API_URL}/users/usersocketid`, {
              userId: storedUserData.id,
              socket_id: socket.id,
            })
            .then(res => {
              console.log(res.data);
              if (res.data) {
                //update the localstorage with the new socket id
                localStorage.setItem(
                  'user',
                  JSON.stringify({ ...storedUserData, socketId: socket.id }),
                );

                console.log('Successfully updated the socketid.');
              } else {
                console.log('Failed To Connect.');
                socket.disconnect(); // Disconnect the socket if the connection fails
              }
            })
            .catch(e => {
              console.log(e);
            });
        }, 100);
      });

      socket.on('close', () => {
        console.log('Socket Connection Terminated.');
        socket.disconnect(); // Disconnect the socket on close
      });

      socket.on('user-join', (res: any) => {
        //console.log(`${JSON.stringify(res)} joined your game.`);
        // Notify(`${res.name} joined your game.`, 3000);

        console.log(res, 'res.key');
        GetConnectedUsers(res.key);
      });

      socket.on('user-leave', res => {
        console.log(`${res.name} left your game.`);
        // Notify(`${res.name} left your game.`, 3000);
        GetConnectedUsers(res.key);
      });
    };

    TryConnect();
  }, []); // No dependencies, runs once on mount

  return (
    <SocketContext.Provider value={null as any}>
      {children}
    </SocketContext.Provider>
  );
};

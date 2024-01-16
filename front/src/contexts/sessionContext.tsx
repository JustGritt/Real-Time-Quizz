import { createContext, useState, ReactNode, useEffect} from 'react';
import axios from 'axios';


interface Session {
  roomkey: string;
  // Add other session properties as needed
}

interface SessionContextProps {
  activeSession?: Session;
  activeSessionUsers: any[]; // Replace any with the actual type
  activeSessionHosted: boolean;
  hostedSessions?: any[]; // Replace any with the actual type
  connectedSessions?: any[]; // Replace any with the actual type
  CreateSession: (title: string) => void;
  DeleteSession: (sessionID: string) => void;
  JoinSession: (roomKey: string) => void;
  LeaveSession: (sessionID: string) => void;
  GetConnectedUsers: (key: string) => void;
}

interface SessionProviderProps {
  children: ReactNode;
}


export const SessionContext = createContext<SessionContextProps | any>(null);

export const SessionProvider = ({ children }: SessionProviderProps) => {

  const [activeSession, setActiveSession] = useState<Session>();
  const [activeSessionUsers, setActiveSessionUsers] = useState<any[]>([]); // Replace any with the actual type
  const [activeSessionHosted, setActiveSessionHosted] =
    useState<boolean>(false);
  const [hostedSessions, setHostedSessions] = useState<any[] | undefined>(); // Replace any with the actual type
  const [connectedSessions, setConnectedSessions] = useState<
    any[] | undefined
  >(); // Replace any with the actual type

  const API_URL =  import.meta.env.VITE_API_BASE_URL + '/api';

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  async function CreateSession(title: string) {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
      const response = await axios.post(`${API_URL}/session`, {
        host: user.id,
        user: user,
        title: title,
      });

      if (response.data && response.data.session) {
        setActiveSession(response.data.session);
        setActiveSessionHosted(true);
        console.log('Successfully created a new game.');
        return response.data.session.roomkey; // Return the session key
      } else {
        console.log('Failed to create session.');
      }
    } catch (error) {
      console.log(`Create Session Error :: ${error}`);
    }
  }

  function JoinSession(roomKey: string): void {
    axios
      .post(`${API_URL}/join`, {
        userID: user.id,
        roomKey,
      })
      .then(res => {
        if (res.data.success === true) {
          setActiveSession(res.data.session);
          setActiveSessionHosted(false);
          console.log('Successfully joined game.');
        }
      })
      .catch(error => {
        console.log(`Join Session Error :: ${error}`);
      });
  }

  function DeleteSession(sessionID: string): void {
    axios
      .post(`${API_URL}/delete`, {
        userID: user.id,
        authKey: user.accessToken, // Assuming accessToken is the correct property
        sessionID,
      })
      .then(res => {
        if (res.data.success === true) {
          setActiveSession(undefined);
          setActiveSessionHosted(false);
          console.log(`${res.data.message}`);
        }
      })
      .catch(error => {
        console.log(`Delete Session Error :: ${error}`);
      });
  }

  function LeaveSession(sessionID: string): void {
    axios
      .post(`${API_URL}/leave`, {
        userID: user.id,
        authKey: user.accessToken, // Assuming accessToken is the correct property
        sessionID,
      })
      .then(res => {
        if (res.data.success === true) {
          console.log('Successfully left game.');
        }
        setActiveSession(undefined);
        setActiveSessionHosted(false);
      })
      .catch(error => {
        console.log(`Leave Session Error :: ${error}`);
      });
  }

  function GetConnectedUsers(key: string): void {
    axios.defaults.headers.common['Authorization'] =
      `Bearer ${user.accessToken}`;
    console.log(user, 'get connected users');
    axios
      .get(`${API_URL}/session/getusers/${key}`)
      .then(res => {
        if (res.data) {
          console.log(res.data.connectedUsers[0]);
          setActiveSessionUsers(res.data.connectedUsers[0]);
          console.log(res.data);
        } else {
          setActiveSessionUsers([]);
        }
      })
      .catch(err => {
        console.log(`Failed To Fetch User Sessions: ${err}`);
      });
  }
  

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        activeSessionUsers,
        activeSessionHosted,
        hostedSessions,
        connectedSessions,
        CreateSession,
        DeleteSession,
        JoinSession,
        LeaveSession,
        GetConnectedUsers,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

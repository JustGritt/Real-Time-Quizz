/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, ReactNode } from 'react';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { UserData } from './socketContext';

interface Session {
  roomkey: string;
  // Add other session properties as needed
}

export type QuizType = {
  id: number;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

interface SessionContextProps {
  activeSession?: Session;
  activeSessionUsers: any[]; // Replace any with the actual type
  activeSessionHosted: boolean;
  hostedSessions?: any[]; // Replace any with the actual type
  connectedSessions?: any[]; // Replace any with the actual type
  quizzes?: QuizType[];
  CreateSession: (title: string, quizId: string) => void;
  DeleteSession: (sessionID: string) => void;
  JoinSession: (roomKey: string) => void;
  JoinGame: (quizId: string) => void;
  LeaveSession: (sessionID: string) => void;
  GetConnectedUsers: (key: string) => void;
  setActiveSession: (session: Session) => void;
  getQuizzes: () => void;
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
  const [quizzes, setQuizzes] = useState<QuizType[] | undefined>();

  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  async function CreateSession(title: string, quizId: string) {
    try {
      axios.defaults.headers.common['Authorization'] =
        `Bearer ${user.accessToken}`;
      const response = await axios.post(`${API_URL}/session`, {
        host: user.id,
        user: user,
        title: title,
      });

      if (response.data) {
        console.log(
          response.data.session,
          'create session session active debug',
        );
        setActiveSession(response.data.session);
        setActiveSessionHosted(true);
        console.log('Successfully created a new game.');
        toast.success('You have created a new game successfully!');
        setTimeout(() => {
          navigate(`/game/${response.data.session.roomKey}?quizId=${quizId}`);
        }, 300);
      }
    } catch (error) {
      toast.error('Sorry, were unable to create a new game. Please try again.');
      setTimeout(() => {
        navigate('/');
      }, 300);
      console.log(`Create Session Error :: ${error}`);
    }
  }

  async function JoinSession(roomKey: string, data: UserData): Promise<void> {
    axios.defaults.headers.common['Authorization'] =
      `Bearer ${user.accessToken}`;
    axios
      .post(`${API_URL}/session/join/${roomKey}`, {
        user: data,
      })
      .then(res => {
        if (res.data && res.data.session) {
          setActiveSession(res.data.session);
          if (res.data.session.host === user.id) {
            setActiveSessionHosted(true);
          } else {
            setActiveSessionHosted(false);
          }
          toast.success('You have joined the room successfully!');
        }
      })
      .catch(error => {
        toast.error('Sorry, were unable to join the game. Please try again.');
        setTimeout(() => {
          navigate('/');
        }, 300);
        console.log(`Join Session Error :: ${error}`);
      });
  }

  // async function JoinGame(qu): Promise<void> {
  //   axios.defaults.headers.common['Authorization'] =
  //     `Bearer ${user.accessToken}`;
  //   axios
  //     .post(`${API_URL}/session/join/${roomKey}`, {
  //       user: data,
  //     })
  //     .then(res => {
  //       if (res.data && res.data.session) {
  //         setActiveSession(res.data.session);
  //         if (res.data.session.host === user.id) {
  //           setActiveSessionHosted(true);
  //         } else {
  //           setActiveSessionHosted(false);
  //         }
  //         toast.success('You have joined the room successfully!');
  //       }
  //     })
  //     .catch(error => {
  //       toast.error('Sorry, were unable to join the game. Please try again.');
  //       setTimeout(() => {
  //         navigate('/');
  //       }, 300);
  //       console.log(`Join Session Error :: ${error}`);
  //     });
  // }

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

  async function LeaveSession(user: UserData, roomKey: string): Promise<void> {
    axios.defaults.headers.common['Authorization'] =
      `Bearer ${user.accessToken}`;
    axios
      .post(`${API_URL}/session/leave`, {
        user,
        roomKey,
      })
      .then(res => {
        console.log(res.data);
        if (res.data) {
          console.log('Successfully left game.');
          toast.success('You have left the room successfully!');
          setActiveSession(undefined);
          setActiveSessionHosted(false);
          setTimeout(() => {
            navigate('/');
          }, 300);
        }
      })
      .catch(error => {
        console.log(`Leave Session Error :: ${error}`);
        toast.error('Failed to leave the room!. Please try again.');
      });
  }

  function GetConnectedUsers(key: string): void {
    axios.defaults.headers.common['Authorization'] =
      `Bearer ${user.accessToken}`;
    axios
      .get(`${API_URL}/session/getusers/${key}`)
      .then(res => {
        if (res.data) {
          console.log(res.data.connectedUsers[0], 'get connected users');
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

  function getQuizzes(): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`
    axios
      .get(`${API_URL}/quizzes`)
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setQuizzes(res.data)
        } else if (res.data.quizzes && Array.isArray(res.data.quizzes)) {
          setQuizzes(res.data.quizzes)
        } else {
          console.log('No quizzes found or response format is unexpected')
          setQuizzes([])
        }
      })
      .catch(error => {
        console.log(`Error getting quizzes :: ${error}`)
        setQuizzes([])
      })
  }


  return (
    <SessionContext.Provider
      value={{
        activeSession,
        activeSessionUsers,
        activeSessionHosted,
        hostedSessions,
        connectedSessions,
        quizzes,
        setActiveSession,
        CreateSession,
        DeleteSession,
        JoinSession,
        LeaveSession,
        GetConnectedUsers,
        getQuizzes,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

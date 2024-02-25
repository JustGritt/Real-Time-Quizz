import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SessionContext } from '../../contexts/sessionContext';
import { SocketContext } from '../../contexts/socketContext';
import Chat from '../../components/Chat';

export default function GameRoom() {
  const navigate = useNavigate();
  const { roomKey } = useParams();
  const { activeSessionUsers, activeSessionHosted, LeaveSession, JoinSession } =
    useContext(SessionContext);
  const { user, loading, setchatMessages } = useContext(SocketContext);
  const myUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLeaveRoom = async () => {
    LeaveSession(myUser, roomKey);
    setchatMessages([]);
  };

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        if (!myUser || !myUser.id) {
          navigate('/login');
          return;
        }
        if (!loading) {
          console.log('game page joining', loading);
          JoinSession(roomKey, myUser);
        }
      } catch (error) {
        toast.error('Login failed!');
      }
    };
    checkUserLogin();
  }, [loading]);

  // Get the quiz details from the server
  useEffect(() => {
    if (roomKey) {
      // Get the quiz details from the server
      console.log(roomKey, 'roomKey');
    }
  }, [roomKey]);

  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 bg-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Game Room: {roomKey}
            </h1>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Connected Users:
              </h2>
              <ul>
                {activeSessionUsers.map((user: any) => (
                  <li key={user.id}>{user.display_name}</li>
                ))}
              </ul>
            </div>
          </div>

          <Chat />
        </>
      )}
    </div>
  );
}

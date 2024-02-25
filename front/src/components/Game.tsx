import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SessionContext } from '../contexts/sessionContext';
import { SocketContext } from '../contexts/socketContext';
import Chat from './Chat';

export default function Game() {
  const navigate = useNavigate();
  const { roomKey } = useParams();
  const { activeSessionUsers, activeSessionHosted, LeaveSession, JoinSession } =
    useContext(SessionContext);
  const { user, loading, setchatMessages } = useContext(SocketContext);
  const myUser = JSON.parse(localStorage.getItem('user') || '{}');
  const hasJoinedRef = useRef(false);

  const handleLeaveRoom = async () => {
    LeaveSession(myUser, roomKey);
    hasJoinedRef.current = false;
    setchatMessages([]);
  };

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        if (!myUser || !myUser.id) {
          navigate('/login');
          return;
        }
        if (!loading && !hasJoinedRef.current) {
          hasJoinedRef.current = true;
          JoinSession(roomKey, myUser);
        }
      } catch (error) {
        toast.error('Login failed!');
      }
    };
    checkUserLogin();
  }, [loading]);

  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 bg-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Quiz Room: {roomKey}
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
              <div>
                {activeSessionHosted ? (
                  <>
                    <button
                      className="mt-6 ml-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => navigate(`/game/${roomKey}/play/${}`)}
                    >
                      Start Game
                    </button>
                    <button
                      className="mt-6 ml-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                      onClick={handleLeaveRoom}
                    >
                      Leave Room
                    </button>
                  </>
                ) : (
                  <button
                    className="mt-4 ml-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                    onClick={handleLeaveRoom}
                  >
                    Leave Room
                  </button>
                )}
              </div>
            </div>
          </div>

          <Chat />
        </>
      )}
    </div>
  );
}

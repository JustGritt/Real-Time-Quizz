import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import apiServices from '../services/apiServices';
import { toast } from 'react-hot-toast';
import { SessionContext } from '../contexts/sessionContext';
import { SocketContext } from '../contexts/socketContext';

interface Message {
  display_name: string;
  key: string;
}


export default function Game() {
  const navigate = useNavigate();
  const { roomKey } = useParams();
  const [users, setUsers] = useState([]);
  const { activeSessionUsers, activeSessionHosted, LeaveSession, JoinSession, GetConnectedUsers } = useContext(SessionContext);
  const { user, loading } = useContext(SocketContext);

  const isMounted = useRef(true);
  
  const handleLeaveRoom = async () => {
    try {
      LeaveSession(roomKey);
      toast.success('You have left the room successfully!');
      setTimeout(() => {
        navigate('/');
      } , 300);
    } catch (error) {
      toast.error('Failed to leave the room!');
    }
  }

  const handleJoinRoom = async () => {
    try {
      /*
      const response = await apiServices.joinSession({
        user,
        roomKey,
      });
      */
      const response = JoinSession(roomKey, user);
      console.log(response, 'hot reload test');
      toast.success('You have joined the room successfully!');
    } catch (error) {
      toast.error('Oops this room does not exist!');
      setTimeout(() => {
        navigate('/');
      }, 300);
    }
  };

  useEffect(() => {
    const checkUserLogin = async () => {
      console.log(user, 'user');
      try {
        if (!user) {
          // If user doesn't exist, navigate to login
          navigate('/login');
          return;
        }

        if (!loading && isMounted.current) {
          // If user exists and component is mounted, join the room
          console.log('user from game reload', user);
          handleJoinRoom();
        }
      } catch (error) {
        toast.error('Login failed!');
      }
    };
    checkUserLogin();
    console.log('check user login', activeSessionUsers);
  }, [loading, navigate, roomKey, user]);

  useEffect(() => {
    return () => {
      // Component unmounting
      isMounted.current = false;
    };
  }, []);


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-32 sm:py-48">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Quiz Room: {roomKey}
          </h1>
          {/*if the user is the hostid show the start game option*/}
        
          {/* Add your game components here */}
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
                      className="mt-4 ml-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                      onClick={ () => navigate(`/game/${roomKey}/play`) }
                    >
                      Start Game
                    </button>
                    <button
                      className="mt-4 ml-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
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
      </div>
    </div>
  );
}


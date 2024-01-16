import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation  } from 'react-router-dom';
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
  const { activeSessionUsers, activeSession } = useContext(SessionContext);
  const { user, loading } = useContext(SocketContext);

  const isMounted = useRef(true);

  const handleJoinRoom = async () => {
    try {
      console.log(user, 'from front', activeSessionUsers);
      // if user.id is already in the activeSessionUsers, don't join
      activeSessionUsers.forEach(element => {
        if (element.id === user.id) {
          toast.error('You are already in the room!');
          return;
        }
      });
      const response = await apiServices.joinSession({
        user,
        roomKey,
      });
      console.log(response, 'hot reload test');
      toast.success('You have joined the room successfully!');
    } catch (error) {
      toast.error('Failed to join the room!');
    }
  };

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        if (!user) {
          // If user doesn't exist, navigate to login
          navigate('/login');
          return;
        }

        if (!loading && isMounted.current && user.id) {
          // If user exists and component is mounted, join the room
          handleJoinRoom();
        }
      } catch (error) {
        toast.error('Login failed!');
      }
    };

    checkUserLogin();
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
          </div>
        </div>
      </div>
    </div>
  );
}


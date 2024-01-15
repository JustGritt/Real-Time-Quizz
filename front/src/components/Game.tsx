import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../libs/socket';
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
  const { activeSessionUsers } = useContext(SessionContext);
  const user = useContext(SocketContext);

  const handleJoinRoom = async () => {
    try {
      const response = await apiServices.joinSession({
        user,
        roomKey,
      });
      console.log(response, 'hot reload test');
      toast.success('You have joined the room successfully!');
    } catch (error) {
      toast.error('Logout failed!');
    }
  };

  const activeUser = activeSessionUsers;

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        handleJoinRoom();
        console.log(user, 'from front');
      } catch (error) {
        toast.error('Login failed!');
      }
    };
    checkUserLogin();
  }, [navigate, users, roomKey, user]);

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
              {activeUser.map((user: any) => (
                <li key={user.id}>{user.display_name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

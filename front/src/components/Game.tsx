import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation  } from 'react-router-dom';
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
  const { activeSessionUsers, activeSessionHosted, LeaveSession, JoinSession, activeSession } = useContext(SessionContext);
  const { user, loading } = useContext(SocketContext);
  const location = useLocation();
  const prevUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [isFromCreateQuiz, setIsFromCreateQuiz] = useState(false);


  const isMounted = useRef(true);
  
  const handleLeaveRoom = async () => {
      LeaveSession(user, roomKey);
  }


  useEffect(() => {
    console.log('game page', location.state);
    const checkUserLogin = async () => {
      console.log(user, 'user');
      try {
        if (!user) {
          // If user doesn't exist, navigate to login
          navigate('/login');
          return;
        }
        if(isMounted.current){
            JoinSession(roomKey, user);
        }
      } catch (error) {
        toast.error('Login failed!');
      }
      
    };
    checkUserLogin();
    console.log('check user login', activeSession);
  }, [loading]);

  useEffect(() => {
    return () => {
      // Component unmounting
      isMounted.current = false;
    };
  }, []);


  return (
      <div className="mx-auto max-w-2xl py-32 sm:py-48 bg-white">
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
                      className="mt-6 ml-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
                      onClick={ () => navigate(`/game/${roomKey}/play`) }
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
      </div>
  );
}


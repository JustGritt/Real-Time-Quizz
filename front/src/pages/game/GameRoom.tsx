import { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SessionContext } from '../../contexts/sessionContext';
import { SocketContext } from '../../contexts/socketContext';
import Chat from '../../components/Chat';
export default function GameRoom() {
  const navigate = useNavigate();
  const { roomKey, quizId } = useParams();
  const { JoinSession } = useContext(SessionContext);
  const { loading, startGame, quizzContent } = useContext(SocketContext);
  const myUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (quizId) startGame(quizId);
  }, [quizId]);

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

  // GET the quiz from the server
  // useEffect(() => {
  //   const fetchQuiz = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/quiz/1`);
  //       console.log(response);
  //     } catch (error) {
  //       console.error('Failed to fetch quiz');
  //     }
  //   };
  //   fetchQuiz();
  // }, [roomKey]);

  console.log(quizzContent);

  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 bg-white">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="text-6xl font-bold mb-4">
              {quizzContent?.question}
            </h2>
            <ul className="w-full grid grid-cols-2 gap-6 mt-16">
              {quizzContent?.answers.map((val, index) => {
                return (
                  // I want each button to have a different color
                  <li key={index}>
                    <button
                      className="w-full p-4 bg-gray-100 rounded-lg hover:bg-[#6366f1] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#6366f1]"
                      onClick={() => {
                        console.log('Answer clicked:', val);
                      }}
                    >
                      {val.answer}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {quizzContent && (
            <Chat
              question={quizzContent.question}
              answers={quizzContent.answers.map(val => val.answer)}
            />
          )}
        </>
      )}
    </div>
  );
}

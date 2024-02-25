import { useState, useContext, useEffect } from 'react';
import { SocketContext } from '../contexts/socketContext';
import { useParams } from 'react-router-dom';

export default function Chat({
  question,
}: {
  question: string;
  answers: string[];
}) {
  const [isChatActive, setChatActive] = useState(false);
  const { user, loading, sendMessage, chatMessages } =
    useContext(SocketContext);
  const [message, setMessage] = useState('');
  const myUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { roomKey } = useParams();

  const toggleChat = () => {
    setChatActive(prev => !prev);
    if (!isChatActive) {
      sendMessage(`${myUser.display_name} has joined the chat.`, roomKey, {
        display_name: 'System',
      });
    }
  };

  const closeChat = () => {
    setChatActive(false);
    sendMessage(`${myUser.display_name} has left the chat.`, roomKey, {
      display_name: 'System',
    });
  };

  const handleSendMessage = () => {
    const forbiddenWords = question.answers.map((answer: string) =>
      answer.toLowerCase(),
    );
    if (
      forbiddenWords.some((word: string) =>
        message.toLowerCase().includes(word),
      )
    ) {
      sendMessage('???', roomKey, myUser);
      setMessage('');
      return;
    }

    if (message.trim() !== '') {
      setMessage(message);
      sendMessage(message, roomKey, myUser);
      setMessage('');
    }
  };

  useEffect(() => {
    if (chatMessages.length) {
      const lastMessageElement = document.getElementById(
        `message-${chatMessages.length - 1}`,
      );

      if (lastMessageElement) {
        lastMessageElement.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      }
    }
  }, [chatMessages.length]);

  return (
    <div className="flex flex-col justify-center items-center">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!isChatActive && (
            <button
              id="chat-toggle"
              onClick={toggleChat}
              className="fixed z-40 left-4 bottom-4 w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-[#6366f1] shadow-lg flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 ease-in-out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                />
              </svg>
            </button>
          )}

          <section
            id="chat"
            className={`fixed flex justify-between items-stretch flex-col z-40 left-4 min-w-[30vw] min-h-[33vw] lg:min-w-[335px] lg:w-[26vw] sm:w-[20rem] rounded-[1rem] bg-[#FAF8FF] overflow-y-hidden transition-all duration-300 ease-in-out ${
              isChatActive
                ? 'bottom-8 transform translate-y-0'
                : 'bottom-0 transform translate-y-full'
            }`}
          >
            <header className="p-4 bg-[#6366f1] border-b border-[#fafafa]">
              <h2 className="text-xl text-white font-bold m-0">
                Chat Room #{roomKey}
              </h2>
              <button
                className="text-white absolute top-4 right-4"
                onClick={closeChat}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </header>

            <div
              id="chat-window"
              className="flex flex-col justify-between p-4 bg-[#FAF8FF] max-h-[30rem] overflow-y-auto"
            >
              <ul className="flex-1 overflow-y-auto gap-4 flex flex-col">
                {chatMessages.map((message, index) => (
                  <li
                    id={`message-${index}`}
                    key={index}
                    className={`py-2 px-4 w-fit max-w-sm break-words ${
                      message.display_name === user?.display_name
                        ? 'text-left rounded-md ml-auto mr-4 bg-[#6366f1] text-white'
                        : 'bg-white'
                    }`}
                  >
                    {message.display_name === 'System' ? null : (
                      <strong>
                        {message.display_name === user?.display_name
                          ? `${user?.display_name} (You)`
                          : message.display_name}
                        <span
                          className={`ml-2 text-xs text-gray-500 font-light ${
                            message.display_name === user?.display_name
                              ? 'text-white'
                              : ''
                          }`}
                        >
                          {message.messageSentAt}
                        </span>
                      </strong>
                    )}
                    <span className="block">{message.message}</span>
                  </li>
                ))}
              </ul>

              <div id="chat-window-input" className="flex items-center mt-4 ">
                <input
                  type="text"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1  block w-full mr-4 text-base"
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent form submission
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  id="chat-window-send"
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none block sm:text-sm bg-[#6366f1] text-white"
                  onClick={handleSendMessage}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

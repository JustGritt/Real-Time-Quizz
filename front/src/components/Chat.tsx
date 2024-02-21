import  { useState, useContext, useRef, useEffect } from 'react';
import { SocketContext } from '../contexts/socketContext';
import { useParams } from 'react-router-dom';

export default function Chat() {
    const [isChatActive, setChatActive] = useState(false);
    const { user, loading, sendMessage, chatMessages, setchatMessages } = useContext(SocketContext);
    const [message, setMessage] = useState('');
    const myUser = JSON.parse(localStorage.getItem('user') || '{}') ;
    const { roomKey } = useParams();
    const ref = useRef<HTMLDivElement>(null);



  const toggleChat = () => {
    setChatActive((prev) => !prev);
  };

  const closeChat = () => {
    setChatActive(false);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      setMessage(message);
      sendMessage(message, roomKey, myUser);
      setMessage(''); // Clear the input field after sending the message
    }
  };

 useEffect(() => {
  if (chatMessages.length) {
    const lastMessage = chatMessages[chatMessages.length - 1];
    const lastMessageElement = document.getElementById(`message-${lastMessage.id}`);
    console.log(lastMessageElement);

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
        {loading ? ( <div>Loading...</div> ) : (
        <>
        {!isChatActive && (
            <button
            id="chat-toggle"
            onClick={toggleChat}
            className="fixed z-40 left-4 bottom-0 w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-[#333] shadow-lg flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 ease-in-out"
            >
            ICON
            </button>
        )}

        <section
            id="chat"
            className={`fixed z-40 left-4 min-w-[30vw] min-h-[33vw] lg:min-w-[335px] lg:w-[26vw] sm:w-[20rem] rounded-[1rem] bg-[#333] overflow-y-hidden transition-all duration-300 ease-in-out ${
            isChatActive ? 'bottom-8 transform translate-y-0' : 'bottom-0 transform translate-y-full'
            }`}
        >
            <header className="p-4 bg-[#333] border-b border-[#60739f]">
            <h2 className="text-xl text-white font-bold m-0">Chat Room</h2>
            <button
                className="text-white absolute top-2 right-2"
                onClick={closeChat}
            >
                Close
            </button>
            </header>

            <div id="chat-window" className="flex flex-col justify-end justify-between p-4 bg-white max-h-[30rem] overflow-y-auto">

            <ul className="flex-1 overflow-y-auto">
                {chatMessages.map((message, index) => (
                    <li key={index}>{message.display_name}: {message.message}</li>
                ))}
            </ul>

            <div id="chat-window-input" className="flex items-center mt-auto">
                <input
                type="text"
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1  block w-full mr-4 text-base"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                />
                <button
                id="chat-window-send"
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none block sm:text-sm bg-[#60739f] text-white"
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
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

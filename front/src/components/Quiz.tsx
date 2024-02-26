import { ChangeEvent, FormEvent, useState, useContext, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { QuizType, SessionContext } from '../contexts/sessionContext';

export default function Quiz() {
  const { CreateSession, getQuizzes, quizzes } = useContext(SessionContext);
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);

  useEffect(() => {
    getQuizzes()
  })

  const handleCreateRoom = async (event: Event) => {
    event.preventDefault();
    if (!selectedQuiz) {
      toast.error('Please select a quiz to start a session');
      return;
    } else {
      CreateSession('Your Session Title', selectedQuiz?.id.toString());
    }
  };

  const handleCreateNewQuiz = async (event: Event) => {
    event.preventDefault();
    navigate('/dashboard/questions');
  };
  return (
    <div className='flex flex-col justify-center items-center md:mb-0 mb-[10rem]'>
      <section className='w-full flex flex-wrap flex-1 justify-center items-center gap-11 my-8'>
        {
          quizzes?.map((quiz: QuizType) => (
            <div className={`flex md:w-[350px] md:mx-0 mx-4 w-full gap-4 justify-start items-start p-4 border-b border-r border-gray-200 rounded-md hover:shadow-none transition-all cursor-pointer
            ${selectedQuiz?.id !== quiz.id ? 'shadow-md' : 'border-indigo-600 border-4'} `}
              onClick={() => {
                selectedQuiz?.id === quiz.id ? setSelectedQuiz(null) : setSelectedQuiz(quiz)
              }} key={quiz.id}
            >
              <div>
                <svg fill="#4f46e5" width="40px" height="40px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <title>lab</title>
                  <path d="M19.332 19.041c0 0-1.664 2.125-3.79 0-2.062-2-3.562 0-3.562 0l-4.967 9.79c-0.144 0.533 0.173 1.081 0.706 1.224h16.497c0.533-0.143 0.85-0.69 0.707-1.224l-5.591-9.79zM26.939 28.33l-7.979-13.428v-0.025l-0.014-7.869h0.551c0.826 0 1.498-0.671 1.498-1.499 0-0.827-0.672-1.498-1.498-1.498h-7.995c-0.827 0-1.498 0.671-1.498 1.498 0 0.828 0.671 1.499 1.498 1.499h0.482l-0.016 7.871-6.908 13.451c-0.428 1.599 0.521 3.242 2.119 3.67h17.641c1.6-0.428 2.549-2.071 2.119-3.67zM24.553 30.998l-17.108-0.019c-1.065-0.286-1.697-1.382-1.412-2.446l6.947-13.616 0.021-8.908h-1.498c-0.275 0-0.499-0.224-0.499-0.5s0.224-0.499 0.499-0.499h7.995c0.275 0 0.498 0.224 0.498 0.499 0 0.276-0.223 0.5-0.498 0.5h-1.498l0.025 8.875 7.939 13.666c0.286 1.067-0.347 2.163-1.411 2.448zM16.48 2.512c0 0.552 0.448 1 1 1s1-0.448 1-1-0.447-1-1-1-1 0.447-1 1zM17.48 0.012c0.828 0 1.5-0.671 1.5-1.5s-0.672-1.5-1.5-1.5-1.5 0.671-1.5 1.5 0.672 1.5 1.5 1.5zM13.48 2.512c0.553 0 1-0.448 1-1s-0.447-1-1-1-1 0.448-1 1 0.447 1 1 1z"></path>
                </svg>
              </div>
              <div className='flex flex-col gap-4 justify-between items-start w-full'>
                <h3 className='font-bold text-2xl'>{quiz.name}</h3>
                <p className='text-gray-500 italic'>
                  {
                    quiz.description ? quiz.description : 'No description'
                  }
                </p>
                <div className='flex gap-2 items-center justify-center'>
                  {
                    typeof (quiz.createdAt) === 'number' &&
                    <>
                      <span className='px-2 py-1 bg-indigo-400 text-white rounded-full text-xs flex gap-1'>
                        <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.3056 1.87868C17.1341 0.707107 15.2346 0.707107 14.063 1.87868L3.38904 12.5526C2.9856 12.9561 2.70557 13.4662 2.5818 14.0232L2.04903 16.4206C1.73147 17.8496 3.00627 19.1244 4.43526 18.8069L6.83272 18.2741C7.38969 18.1503 7.89981 17.8703 8.30325 17.4669L18.9772 6.79289C20.1488 5.62132 20.1488 3.72183 18.9772 2.55025L18.3056 1.87868ZM15.4772 3.29289C15.8677 2.90237 16.5009 2.90237 16.8914 3.29289L17.563 3.96447C17.9535 4.35499 17.9535 4.98816 17.563 5.37868L15.6414 7.30026L13.5556 5.21448L15.4772 3.29289ZM12.1414 6.62869L4.80325 13.9669C4.66877 14.1013 4.57543 14.2714 4.53417 14.457L4.0014 16.8545L6.39886 16.3217C6.58452 16.2805 6.75456 16.1871 6.88904 16.0526L14.2272 8.71448L12.1414 6.62869Z" fill="#fff" />
                        </svg>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </>
                  }
                  {
                    typeof (quiz.updatedAt) === 'number' &&
                    <>
                      <span className='px-2 py-1 bg-indigo-400 text-white rounded-full text-xs flex gap-1'>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.4721 16.7023C17.3398 18.2608 15.6831 19.3584 13.8064 19.7934C11.9297 20.2284 9.95909 19.9716 8.25656 19.0701C6.55404 18.1687 5.23397 16.6832 4.53889 14.8865C3.84381 13.0898 3.82039 11.1027 4.47295 9.29011C5.12551 7.47756 6.41021 5.96135 8.09103 5.02005C9.77184 4.07875 11.7359 3.77558 13.6223 4.16623C15.5087 4.55689 17.1908 5.61514 18.3596 7.14656C19.5283 8.67797 20.1052 10.5797 19.9842 12.5023M19.9842 12.5023L21.4842 11.0023M19.9842 12.5023L18.4842 11.0023" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M12 8V12L15 15" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {new Date(quiz.updatedAt).toLocaleDateString()}
                      </span>
                    </>
                  }
                </div>
              </div>
            </div>
          ))
        }
      </section>
      <form
        className="flex items-center justify-center gap-x-6"
      // onSubmit={handleCreateRoom}
      >
        <label htmlFor="room" className="sr-only">
          Create a room to start a quiz
        </label>

        <div className="flex gap-x-4">
          <button
            onClick={handleCreateRoom}
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm sm:leading-6"
          >
            Start a Quiz
          </button>
          <button
            onClick={handleCreateNewQuiz}
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm sm:leading-6"
          >
            Create new Quizz
          </button>
        </div>
      </form>
    </div>
  );
}

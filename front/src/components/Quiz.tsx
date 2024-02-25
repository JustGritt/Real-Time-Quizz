import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { SessionContext } from '../contexts/sessionContext';

export default function Quiz() {
  const { CreateSession } = useContext(SessionContext);
  const handleCreateRoom = async (event: Event) => {
    event.preventDefault();
    CreateSession('Your Session Title');
  };

  const handleCreateNewQuiz = async (event: Event) => {
    event.preventDefault();
    console.log('Create new Quiz');
  };

  return (
    <div>
      <h1>Quiz</h1>
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

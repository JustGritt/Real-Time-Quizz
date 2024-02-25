import { ChangeEvent, FormEvent, useState, useContext } from 'react';
import AnswerRow from './AnswerRow';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

export default function Question() {
  const handleCreateQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = event.currentTarget.question.value;
    console.log(question, answers);

    // Send the question to the server
    const req = axios.post(`${API_URL}/question/new`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        question,
        answers,
      },
    });
    const res = await req;
    console.log(res);
  };

  // The number of answers
  const [answerCount, setAnswerCount] = useState(2);

  // Handle the answer change (update the answer content of a specific row)
  const [answers, setAnswers] = useState(Array(answerCount).fill(''));
  const handleAnswerChange = (answerRowId: number, newAnswer: string) => {
    const newAnswers = [...answers];
    newAnswers[answerRowId] = newAnswer;
    setAnswers(newAnswers);
  };

  // Up to 8 answers
  const handleAnswerRow = (answerCount: number) => {
    if (answerCount > 4) return;
    setAnswerCount(answerCount);
    setAnswers(prev => [...prev, '']); // Add a new empty answer when a row is added
  };

  return (
    <div>
      <p>In this page, you can create a new question</p>
      <form
        className="flex items-start justify-center gap-x-6 py-8 flex-col mt-8"
        onSubmit={handleCreateQuestion}
      >
        <div className="mb-5 w-full">
          <label
            htmlFor="text"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Question<sup className="text-red-500">*</sup>
          </label>
          <input
            type="text"
            id="question"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="How many continents are there in the world?"
            required
          />
        </div>

        <ul className="w-full grid grid-cols-2 gap-6">
          {[...Array(answerCount)].map((_, index) => {
            return (
              <AnswerRow
                key={index}
                index={index}
                answerContent={answers[index]}
                onAnswerChange={(newAnswer: string) =>
                  handleAnswerChange(index, newAnswer)
                }
              />
            );
          })}
        </ul>

        <div className="w-full flex">
          {answerCount < 4 && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => handleAnswerRow(answerCount + 1)}
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
          )}

          {answerCount > 2 && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => handleAnswerRow(answerCount - 1)}
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                    d="M5 12h14"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        <label htmlFor="room" className="sr-only">
          Create a new question
        </label>

        <div>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm sm:leading-6"
          >
            Add new question
          </button>
        </div>
      </form>
    </div>
  );
}

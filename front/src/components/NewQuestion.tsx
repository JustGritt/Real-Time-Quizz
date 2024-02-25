import { useState } from 'react';
import AnswerRow from './AnswerRow';

// Index of the question
export default function NewQuestion({ index }: { index: number }) {
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
    <section className="mb-4 w-full" data-question={`question-${index + 1}`}>
      <div className="mb-5 w-full">
        <label
          htmlFor="text"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Question {index + 1}
          <sup className="text-red-500">*</sup>
        </label>
        <input
          id={`question-${index}`}
          type="text"
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
    </section>
  );
}

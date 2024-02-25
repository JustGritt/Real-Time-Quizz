import { FormEvent, useState } from 'react';
import AnswerRow from './AnswerRow';
import axios from 'axios';
import NewQuestion from './NewQuestion';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

export default function Question() {
  const [questionCount, setQuestionCount] = useState(1);
  const handleQuestionRow = (questionCount: number) => {
    if (questionCount > 10 || questionCount === 0) return;
    setQuestionCount(questionCount);
  };

  const handleSubmitQuiz = async (event: FormEvent) => {
    event.preventDefault();

    // Get the questions and answers of each question
    const questions = Array.from(
      document.querySelectorAll('section[data-question]'),
    );
    const data = Array.from(questions).map((question: any) => {
      const questionContent = question.querySelector('input')?.value;
      const answers = Array.from(
        question.querySelectorAll('input[data-answer]'),
      ).map((answer: any) => answer.value);
      return { question: questionContent, answers };
    });

    // Send the data to the server (Create a a new quiz, then add the questions and answers)
    const response = await axios.post(`${API_URL}/quiz/new`, data);
    console.log(response.data);
  };

  return (
    <div className="pb-16">
      <p>In this page, you can create a new question</p>
      <form
        className="flex items-start justify-center gap-x-6 py-8 flex-col mt-8"
        onSubmit={handleSubmitQuiz}
      >
        <section className="mb-4 w-full">
          <div className="mb-5 w-full">
            <label
              htmlFor="quizName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Quiz name
              <sup className="text-red-500">*</sup>
            </label>
            <input
              name="quizName"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Geography Quiz"
              required
            />
          </div>
        </section>

        {[...Array(questionCount)].map((_, index) => {
          return <NewQuestion key={index} index={index} />;
        })}

        <div className="flex gap-x-4 justify-between w-full">
          <div className="flex gap-4">
            <button
              onClick={() => handleQuestionRow(questionCount + 1)}
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Add new question
            </button>
            <button
              onClick={() => handleQuestionRow(questionCount - 1)}
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Remove last question
            </button>
          </div>

          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm sm:leading-6"
          >
            Save Quiz
          </button>
        </div>
      </form>
    </div>
  );
}

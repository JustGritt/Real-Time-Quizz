export default function AnswerRow({
  index,
  answerContent = '',
  onAnswerChange,
}: {
  index: number;
  answerContent?: string;
  onAnswerChange?: (newAnswer: string) => void;
}) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onAnswerChange) {
      onAnswerChange(event.target.value);
    }
  };

  return (
    <div className="mb-5 w-full">
      <label
        htmlFor={'answer-' + index + 1}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Answer {index + 1}
        <sup className="text-red-500">*</sup>
      </label>
      <input
        type="text"
        id={'answer-' + index + 1}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
        value={answerContent || ''}
        onChange={handleChange}
      />
    </div>
  );
}

import { useState } from 'react';
import { generateQuestions } from '@/lib/api';

export default function QuestionGenerator() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [examType, setExamType] = useState('');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const generatedQuestions = await generateQuestions(topic, difficulty, examType, count);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic"
          className="w-full p-2 border rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="text"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          placeholder="Exam Type"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          min="1"
          max="20"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Generate Questions
        </button>
      </form>
      
      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Generated Questions:</h2>
          <ul className="list-decimal pl-5">
            {questions.map((question, index) => (
              <li key={index} className="mb-2">{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
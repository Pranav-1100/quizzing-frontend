'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const generatedQuestions = await api.questions.generate(data);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Study Questions</h1>
      <AnimatedCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block mb-1">Topic</label>
            <input
              id="topic"
              {...register('topic', { required: 'Topic is required' })}
              className="input"
              placeholder="e.g., Algebra"
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>}
          </div>
          <div>
            <label htmlFor="difficulty" className="block mb-1">Difficulty</label>
            <select
              id="difficulty"
              {...register('difficulty', { required: 'Difficulty is required' })}
              className="input"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>}
          </div>
          <div>
            <label htmlFor="examType" className="block mb-1">Exam Type</label>
            <input
              id="examType"
              {...register('examType', { required: 'Exam Type is required' })}
              className="input"
              placeholder="e.g., SAT, GMAT"
            />
            {errors.examType && <p className="text-red-500 text-sm mt-1">{errors.examType.message}</p>}
          </div>
          <div>
            <label htmlFor="count" className="block mb-1">Number of Questions</label>
            <input
              id="count"
              type="number"
              {...register('count', { required: 'Number of questions is required', min: 1, max: 20 })}
              className="input"
              placeholder="Enter a number between 1 and 20"
            />
            {errors.count && <p className="text-red-500 text-sm mt-1">{errors.count.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </form>
      </AnimatedCard>

      {questions.length > 0 && (
        <AnimatedCard className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Questions</h2>
          <ul className="space-y-4">
            {questions.map((question, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow">
                <p className="font-semibold mb-2">{question.text}</p>
                {question.options && (
                  <ul className="ml-4 list-disc">
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex}>{option}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </AnimatedCard>
      )}
    </div>
  );
}
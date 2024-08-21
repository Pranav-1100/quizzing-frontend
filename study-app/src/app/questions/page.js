'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';
import { withAuth } from '@/components/withAuth';

function QuestionsPage() {
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
      // Add user-friendly error handling here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Generate Study Questions</h1>
      <AnimatedCard className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              id="topic"
              {...register('topic', { required: 'Topic is required' })}
              className="input w-full"
              placeholder="e.g., Algebra"
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>}
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              id="difficulty"
              {...register('difficulty', { required: 'Difficulty is required' })}
              className="input w-full"
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {errors.difficulty && <p className="text-red-500 text-sm mt-1">{errors.difficulty.message}</p>}
          </div>
          <div>
            <label htmlFor="examType" className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
            <input
              id="examType"
              {...register('examType', { required: 'Exam Type is required' })}
              className="input w-full"
              placeholder="e.g., SAT, GMAT"
            />
            {errors.examType && <p className="text-red-500 text-sm mt-1">{errors.examType.message}</p>}
          </div>
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
            <input
              id="count"
              type="number"
              {...register('count', { required: 'Number of questions is required', min: 1, max: 20 })}
              className="input w-full"
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
        <AnimatedCard className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-primary">Generated Questions</h2>
          <ul className="space-y-8">
            {questions.map((question, index) => (
              <li key={question.id} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-4">{question.content}</p>
                {question.options && question.options.length > 0 && (
                  <ul className="ml-6 list-disc space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <li key={optionIndex} className="text-gray-700">{option}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 text-sm text-gray-600">
                  <p>Difficulty: {question.difficulty}</p>
                  <p>Subject: {question.subject}</p>
                  <p>Type: {question.type}</p>
                </div>
              </li>
            ))}
          </ul>
        </AnimatedCard>
      )}
    </div>
  );
}

export default withAuth(QuestionsPage);
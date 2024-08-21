'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';

export default function StudyPlanPage() {
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const generatedPlan = await api.studyPlan.generate(data);
      setStudyPlan(generatedPlan);
    } catch (error) {
      console.error('Failed to generate study plan:', error);
      alert('Failed to generate study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (progress) => {
    try {
      await api.studyPlan.updateProgress(studyPlan.id, progress);
      setStudyPlan({ ...studyPlan, progress });
      alert('Progress updated successfully!');
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Study Plan</h1>
      <AnimatedCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="examDate" className="block mb-1">Exam Date</label>
            <input
              id="examDate"
              type="date"
              {...register('examDate', { required: 'Exam Date is required' })}
              className="input"
            />
            {errors.examDate && <p className="text-red-500 text-sm mt-1">{errors.examDate.message}</p>}
          </div>
          <div>
            <label htmlFor="subjects" className="block mb-1">Subjects (comma-separated)</label>
            <input
              id="subjects"
              {...register('subjects', { required: 'At least one subject is required' })}
              className="input"
              placeholder="e.g., Math, Physics, Chemistry"
            />
            {errors.subjects && <p className="text-red-500 text-sm mt-1">{errors.subjects.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Study Plan'}
          </button>
        </form>
      </AnimatedCard>

      {studyPlan && (
        <AnimatedCard className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Study Plan</h2>
          <div className="space-y-4">
            {studyPlan.schedule.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{item.date}</h3>
                <ul className="ml-4 list-disc">
                  {item.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Progress</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={studyPlan.progress * 100}
                onChange={(e) => handleUpdateProgress(e.target.value / 100)}
                className="w-full"
              />
              <span>{Math.round(studyPlan.progress * 100)}%</span>
            </div>
          </div>
        </AnimatedCard>
      )}
    </div>
  );
}
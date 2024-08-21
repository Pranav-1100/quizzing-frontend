'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import AnimatedCard from '@/components/AnimatedCard';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      setValue('username', user.username);
      setValue('email', user.email);
      setValue('preferredSubjects', user.preferredSubjects.join(', '));
      setValue('examPreparation', user.examPreparation);
      setValue('difficultyPreference', user.difficultyPreference);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const updatedProfile = await api.profile.update({
        ...data,
        preferredSubjects: data.preferredSubjects.split(',').map(subject => subject.trim()),
      });
      alert('Profile updated successfully!');
      // Update the user context here if necessary
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <AnimatedCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              id="username"
              {...register('username', { required: 'Username is required' })}
              className="input"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="input"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="preferredSubjects" className="block mb-1">Preferred Subjects (comma-separated)</label>
            <input
              id="preferredSubjects"
              {...register('preferredSubjects')}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="examPreparation" className="block mb-1">Exam Preparation</label>
            <input
              id="examPreparation"
              {...register('examPreparation')}
              className="input"
            />
          </div>
          <div>
            <label htmlFor="difficultyPreference" className="block mb-1">Difficulty Preference</label>
            <select
              id="difficultyPreference"
              {...register('difficultyPreference')}
              className="input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
        <button onClick={logout} className="btn btn-secondary w-full mt-4">
          Logout
        </button>
      </AnimatedCard>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';
import Modal from '@/components/Modal';

export default function DoubtsPage() {
  const [doubts, setDoubts] = useState([]);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [showDoubtModal, setShowDoubtModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      const fetchedDoubts = await api.doubts.getAll(1, 10);
      setDoubts(fetchedDoubts);
    } catch (error) {
      console.error('Failed to fetch doubts:', error);
      alert('Failed to fetch doubts. Please try again.');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.doubts.create(data);
      reset();
      fetchDoubts();
      alert('Doubt created successfully!');
    } catch (error) {
      console.error('Failed to create doubt:', error);
      alert('Failed to create doubt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDoubt = async (id) => {
    try {
      const doubt = await api.doubts.getById(id);
      setSelectedDoubt(doubt);
      setShowDoubtModal(true);
    } catch (error) {
      console.error('Failed to fetch doubt details:', error);
      alert('Failed to fetch doubt details. Please try again.');
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Doubts Forum</h1>
      <AnimatedCard>
        <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">Title</label>
            <input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="input"
              placeholder="Enter your question title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="content" className="block mb-1">Content</label>
            <textarea
              id="content"
              {...register('content', { required: 'Content is required' })}
              className="input h-32"
              placeholder="Describe your question in detail"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <label htmlFor="subject" className="block mb-1">Subject</label>
            <input
              id="subject"
              {...register('subject', { required: 'Subject is required' })}
              className="input"
              placeholder="e.g., Mathematics, Physics"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Question'}
            </button>
          </form>
        </AnimatedCard>
  
        <AnimatedCard className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Questions</h2>
          {doubts.length > 0 ? (
            <ul className="space-y-4">
              {doubts.map((doubt) => (
                <li key={doubt.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{doubt.title}</h3>
                  <p className="text-gray-600 mt-1">{doubt.subject}</p>
                  <p className="mt-2 truncate">{doubt.content}</p>
                  <button
                    onClick={() => handleViewDoubt(doubt.id)}
                    className="mt-2 text-primary hover:underline"
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No questions have been asked yet. Be the first to ask!</p>
          )}
        </AnimatedCard>
      </div>
    );
  }
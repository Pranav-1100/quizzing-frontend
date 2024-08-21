'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';
import Modal from '@/components/Modal';
import { withAuth } from '@/components/withAuth';

function DoubtsPage() {
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
      const response = await api.doubts.getAll(1, 10);
      setDoubts(response.rows);
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

  const handleAddComment = async (comment) => {
    try {
      await api.doubts.addComment(selectedDoubt.id, { content: comment });
      const updatedDoubt = await api.doubts.getById(selectedDoubt.id);
      setSelectedDoubt(updatedDoubt);
      fetchDoubts(); // Refresh the doubts list
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleResolveDoubt = async () => {
    try {
      await api.doubts.resolve(selectedDoubt.id);
      setSelectedDoubt({ ...selectedDoubt, isResolved: true });
      fetchDoubts(); // Refresh the doubts list
      setShowDoubtModal(false);
    } catch (error) {
      console.error('Failed to resolve doubt:', error);
      alert('Failed to resolve doubt. Please try again.');
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
                <p className="text-gray-600 mt-1">Subject: {doubt.subject}</p>
                <p className="text-gray-600 mt-1">By: {doubt.user.username}</p>
                <p className="mt-2 truncate">{doubt.content}</p>
                <button
                  onClick={() => handleViewDoubt(doubt.id)}
                  className="mt-2 text-primary hover:underline"
                >
                  View Details
                </button>
                {doubt.isResolved && (
                  <span className="ml-2 text-green-500">Resolved</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions have been asked yet. Be the first to ask!</p>
        )}
      </AnimatedCard>

      <Modal
        isOpen={showDoubtModal}
        onClose={() => setShowDoubtModal(false)}
        title={selectedDoubt?.title}
      >
        {selectedDoubt && (
          <div className="space-y-4">
            <p><strong>Subject:</strong> {selectedDoubt.subject}</p>
            <p><strong>Asked by:</strong> {selectedDoubt.user.username}</p>
            <p><strong>Question:</strong> {selectedDoubt.content}</p>
            <div>
              <h4 className="font-semibold">Comments:</h4>
              {selectedDoubt.comments.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {selectedDoubt.comments.map((comment, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded">
                      {comment.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddComment(e.target.comment.value);
              e.target.comment.value = '';
            }}>
              <textarea
                name="comment"
                className="input h-24 w-full"
                placeholder="Add a comment..."
                required
              />
              <button type="submit" className="btn btn-secondary mt-2">
                Add Comment
              </button>
            </form>
            {!selectedDoubt.isResolved && (
              <button onClick={handleResolveDoubt} className="btn btn-primary">
                Mark as Resolved
              </button>
            )}
            {selectedDoubt.isResolved && (
              <p className="text-green-500 font-semibold">This doubt has been resolved.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default withAuth(DoubtsPage);
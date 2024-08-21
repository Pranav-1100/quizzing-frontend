'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';
import Modal from '@/components/Modal';
import { withAuth } from '@/components/withAuth';
import Flashcard from '@/components/Flashcard';

function NotesPage() {
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const generatedNotes = await api.notes.generate(data);
      setNotes(generatedNotes);
    } catch (error) {
      console.error('Failed to generate notes:', error);
      alert('Failed to generate notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await api.notes.share(notes.id);
      setShowShareModal(true);
    } catch (error) {
      console.error('Failed to share notes:', error);
      alert('Failed to share notes. Please try again.');
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      const generatedFlashcards = await api.notes.generateFlashcards(notes.id);
      setFlashcards(generatedFlashcards);
      setShowFlashcardsModal(true);
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      alert('Failed to generate flashcards. Please try again.');
    }
  };

  const formatNotes = (content) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 list-disc">{line.slice(2)}</li>;
      }
      return <p key={index} className="mb-2">{line}</p>;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Study Notes</h1>
      <AnimatedCard>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block mb-1">Topic</label>
            <input
              id="topic"
              {...register('topic', { required: 'Topic is required' })}
              className="input"
              placeholder="e.g., World War II"
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{errors.topic.message}</p>}
          </div>
          <div>
            <label htmlFor="examType" className="block mb-1">Exam Type</label>
            <input
              id="examType"
              {...register('examType', { required: 'Exam Type is required' })}
              className="input"
              placeholder="e.g., History AP"
            />
            {errors.examType && <p className="text-red-500 text-sm mt-1">{errors.examType.message}</p>}
          </div>
          <div>
            <label htmlFor="format" className="block mb-1">Format</label>
            <select
              id="format"
              {...register('format', { required: 'Format is required' })}
              className="input"
            >
              <option value="">Select Format</option>
              <option value="bullet-points">Bullet Points</option>
              <option value="paragraph">Paragraph</option>
              <option value="mind-map">Mind Map</option>
            </select>
            {errors.format && <p className="text-red-500 text-sm mt-1">{errors.format.message}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Notes'}
          </button>
        </form>
      </AnimatedCard>

      {notes && (
        <AnimatedCard className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Notes</h2>
          <div className="prose max-w-none">
            {formatNotes(notes.content)}
          </div>
          <div className="mt-4 space-x-4">
            <button onClick={handleShare} className="btn btn-secondary">
              Share Notes
            </button>
            <button onClick={handleGenerateFlashcards} className="btn btn-secondary">
              Generate Flashcards
            </button>
          </div>
        </AnimatedCard>
      )}

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Notes Shared"
      >
        <div className="p-4 bg-gray-100 rounded-md">
          <p className="mb-2">Your notes have been successfully shared!</p>
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>study_notes.pdf</span>
          </div>
        </div>
      </Modal>

      <Modal
  isOpen={showFlashcardsModal}
  onClose={() => setShowFlashcardsModal(false)}
  title="Generated Flashcards"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {flashcards.map((flashcard, index) => (
      <Flashcard key={index} question={flashcard} />
    ))}
  </div>
</Modal>
    </div>
  );
}

export default withAuth(NotesPage);
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';
import Modal from '@/components/Modal';

export default function NotesPage() {
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
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: notes.content }} />
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
        <p>Your notes have been successfully shared!</p>
      </Modal>

      <Modal
        isOpen={showFlashcardsModal}
        onClose={() => setShowFlashcardsModal(false)}
        title="Generated Flashcards"
      >
        <div className="space-y-4">
          {flashcards.map((flashcard, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold">Front: {flashcard.front}</p>
              <p className="mt-2">Back: {flashcard.back}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
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
}
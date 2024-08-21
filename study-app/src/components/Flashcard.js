'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ question }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [front, back] = question.question.split('Front of flashcard:')[1].split('\n').filter(line => line.trim() !== '');

  return (
    <div className="w-full h-48 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute w-full h-full backface-hidden bg-white p-4 rounded-lg shadow-md flex items-center justify-center text-center">
          <p className="font-semibold">{front}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-indigo-100 p-4 rounded-lg shadow-md flex items-center justify-center text-center"
             style={{ transform: 'rotateY(180deg)' }}>
          <p>{back}</p>
        </div>
      </motion.div>
    </div>
  );
}
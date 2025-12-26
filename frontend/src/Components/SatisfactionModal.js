import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { format } from 'date-fns';

const EMOJIS = [
  { emoji: "😄", label: "Very Satisfied" },
  { emoji: "🙂", label: "Satisfied" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "🙁", label: "Dissatisfied" },
  { emoji: "😞", label: "Very Dissatisfied" }
];

const EMOJI_RESPONSES = {
  "😄": "Yayy!",
  "🙂": "Nice!",
  "😐": "Alright!",
  "🙁": "Hmm...",
  "😞": "Awww!"
};

const createOrUpdateSatisfaction = async (logData) => {
  const { data } = await apiClient.post('/satisfaction', logData);
  return data;
};

export default function SatisfactionModal({ onSuccess, onClose, date, currentMood }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  const mutation = useMutation({
    mutationFn: createOrUpdateSatisfaction,
    onSuccess: () => {
      setTimeout(() => {
        onSuccess();
      }, 1200);
    },
  });

  const handleSelect = (emoji) => {
    if (mutation.isLoading) return;
    setSelectedEmoji(emoji);
    mutation.mutate({
      log_date: date,
      satisfaction_level: emoji,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, type: 'spring' }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md glass rounded-3xl p-6 border border-purple-400/30 shadow-2xl neon-glow-purple">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Set your Hustle Meter</h2>
            <p className="text-gray-400 mb-2">For {format(new Date(date), 'MMMM do')}</p>
            {currentMood && <p className="text-sm text-gray-500 mb-6">Currently: {currentMood}</p>}
            {!currentMood && <p className="text-sm text-gray-500 mb-6">No mood logged yet</p>}
            
            {mutation.isError && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 mb-4 text-sm"
              >
                Failed to save. Please try again.
              </motion.p>
            )}
            
            <AnimatePresence mode="wait">
              {mutation.isSuccess && selectedEmoji ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-24"
                >
                  <div className="text-6xl">
                    {selectedEmoji}
                  </div>
                  <p className="font-bold text-green-400 mt-4">{EMOJI_RESPONSES[selectedEmoji]}</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="selection"
                  className="flex justify-around items-center h-24"
                >
                  {EMOJIS.map(({ emoji, label }, index) => (
                    <motion.button
                      key={emoji}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                      whileHover={{ scale: 1.4, rotate: [0, 10, -10, 0] }}
                      whileTap={{ scale: 1.2 }}
                      onClick={() => handleSelect(emoji)}
                      className={`text-5xl cursor-pointer disabled:opacity-50 relative ${
                        emoji === currentMood ? 'glass rounded-full p-2 border border-cyan-400/50 neon-glow-blue' : ''
                      }`}
                      title={label}
                      disabled={mutation.isLoading}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="mt-4 px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
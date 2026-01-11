import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CourseSelection from '../Components/CourseSelection';

export default function OnboardingCourses() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Final Step...
        </h1>
        <p className="text-gray-400 mb-8">
          Select your Electives and LAs
        </p>
        <div className="glass rounded-3xl p-8 border border-purple-400/30 shadow-2xl neon-glow-purple">
          <CourseSelection onComplete={() => navigate('/')} />
        </div>
      </motion.div>
    </div>
  );
}
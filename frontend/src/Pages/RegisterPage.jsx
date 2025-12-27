import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../apiClient';
import { User, Mail, Lock } from 'lucide-react';

const registerUser = async (userData) => {
  const { data } = await apiClient.post('/users/register', userData);
  return data;
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate('/login');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    mutation.mutate({
      email,
      password,
      full_name: fullName,
      mess_cycle: "weeks_1_3",
      last_cycle_update: today,
      manual_cycle_override: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <form 
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-8 border border-purple-400/30 shadow-2xl neon-glow-purple"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-400">Join the CampusCue community</p>
          </div>

          {mutation.isError && (
            <motion.div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 rounded-xl text-center">
              <p className="text-red-300 font-medium text-sm">
                {mutation.error.response?.data?.detail || "Registration failed. Please try again."}
              </p>
            </motion.div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-gray-600/50 text-white focus:outline-none"/>
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-gray-600/50 text-white focus:outline-none"/>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-gray-600/50 text-white focus:outline-none"/>
            </div>
          </div>
          
          <motion.button type="submit" disabled={mutation.isLoading} className="w-full mt-8 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-50">
            {mutation.isLoading ? 'Creating Account...' : 'Sign Up'}
          </motion.button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
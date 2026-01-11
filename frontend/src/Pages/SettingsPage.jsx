import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '@/apiClient';
import { ArrowLeft, User, Leaf, Bell } from 'lucide-react';
import DietaryChoice from '../Components/DietaryChoice';

const fetchCurrentUser = async () => {
  const { data } = await apiClient.get('/users/me');
  return data;
};

const updateUserProfile = async (profileData) => {
  const { data } = await apiClient.patch('/users/me/profile', profileData);
  return data;
};

export default function SettingsPage() {
  const { data: currentUser, isLoading } = useQuery({ queryKey: ['currentUser'], queryFn: fetchCurrentUser });
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name);
    }
  }, [currentUser]);

  if (isLoading || !currentUser) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">Loading Settings...</div>;
  }

  const handleNameSave = () => {
    if (fullName !== currentUser.full_name) {
      mutation.mutate({ full_name: fullName });
    }
  };

  const handlePromptToggle = () => {
    mutation.mutate({ enable_satisfaction_prompt: !currentUser.enable_satisfaction_prompt });
  };
  
  const handleDietSelect = (newDiet) => {
    if (newDiet !== currentUser.diet_type) {
        mutation.mutate({ diet_type: newDiet });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center gap-4 mb-8">
          <Link to="/">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 glass hover:bg-gray-700/50 rounded-xl transition-all border border-gray-600/50">
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </motion.button>
          </Link>
          <h1 className="absolute left-1/2 -translate-x-1/2 leading-[1.2] pb-1 text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Settings</h1>
        </motion.div>
        
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5 text-purple-400" /> Profile</h2>
            <div className="flex items-center gap-3">
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 glass rounded-xl border border-gray-600/50 text-white focus:border-purple-400/50 focus:outline-none transition-all" />
              <motion.button onClick={handleNameSave} disabled={mutation.isLoading || fullName === currentUser.full_name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 rounded-xl font-bold bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed">
                {mutation.isLoading && mutation.variables?.full_name ? 'Saving...' : 'Save'}
              </motion.button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Leaf className="w-5 h-5 text-green-400" /> Dietary Preference</h2>
            <DietaryChoice 
              currentChoice={currentUser.diet_type}
              onSelect={handleDietSelect}
              isLoading={mutation.isLoading && mutation.variables?.diet_type}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-cyan-400" /> Notifications</h2>
            <div className="flex items-center justify-between">
              <p className="text-gray-300">Enable daily satisfaction prompt</p>
              <button onClick={handlePromptToggle} disabled={mutation.isLoading && mutation.variables?.hasOwnProperty('enable_satisfaction_prompt')} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:opacity-50 ${currentUser.enable_satisfaction_prompt ? 'bg-purple-600' : 'bg-gray-600'}`}>
                <motion.span layout className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${currentUser.enable_satisfaction_prompt ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
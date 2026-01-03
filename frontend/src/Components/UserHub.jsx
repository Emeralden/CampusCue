import React, { useState } from 'react';
import { Settings, TrendingUp, LogOut, MoreVertical, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import apiClient from '@/apiClient';

export default function UserHub() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const toggleCycleMutationFn = async () => {
    const { data } = await apiClient.post('/users/me/toggle-mess-cycle');
    return data;
  };

  const toggleCycleMutation = useMutation({
    mutationFn: toggleCycleMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myMenu'] });
    },
  });

  const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  navigate('/login');
};

  const menuItems = [
    {
      icon: Repeat,
      label: 'Toggle Menu',
      onClick: () => toggleCycleMutation.mutate(),
      color: 'text-orange-400'
    },

    {
      icon: TrendingUp,
      label: 'Hustle Meter',
      onClick: () => navigate('/satisfaction'),
      color: 'text-purple-400'
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => {},
      color: 'text-gray-400'
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: handleLogout,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-300" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-56 glass rounded-2xl border border-purple-400/20 shadow-[0_0_8px_rgba(168,85,247,0.25)] z-50 overflow-hidden"
            >
              <div className="p-2">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => {
                        item.onClick();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-700/50 transition-all text-left group"
                    >
                      <IconComponent className={`w-5 h-5 ${item.color} transition-transform`} />
                      <span className="text-white font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
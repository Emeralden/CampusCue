import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Repeat } from 'lucide-react';
import apiClient from '@/apiClient';

export default function CycleToggleReminderModal({ onToggled, onDismiss, currentCycle, confirmOnly = false, confirmedCycleName = '' }) {
  const [toggled, setToggled] = useState(confirmOnly);
  const queryClient = useQueryClient();

  const toggleCycleMutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post('/users/me/toggle-mess-cycle');
      return data;
    },
    onSuccess: () => {
      setToggled(true);
      queryClient.invalidateQueries({ queryKey: ['myMenu'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      setTimeout(() => {
        if (onToggled) onToggled();
      }, 1200);
    },
  });

  useEffect(() => {
    if (confirmOnly) {
      const timer = setTimeout(() => {
        if (onToggled) onToggled();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [confirmOnly]);

  const handleToggle = () => {
    if (toggleCycleMutation.isPending) return;
    toggleCycleMutation.mutate();
  };

  const targetCycle = currentCycle === 'weeks_1_3' ? 'Weeks 2 & 4' : 'Weeks 1 & 3';
  const displayCycle = confirmOnly ? confirmedCycleName : targetCycle;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={confirmOnly ? onToggled : onDismiss} />
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md glass rounded-3xl p-6 border border-orange-400/30 shadow-2xl neon-glow-orange">
          <div className="text-center">
            <AnimatePresence mode="wait">
              {toggled ? (
                <motion.div key="toggled" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-4">
                  <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Repeat className="w-14 h-14 text-green-400" />
                  </motion.div>
                  <p className="font-bold text-green-400 mt-4 text-lg">Switched!</p>
                  <p className="text-gray-400 text-sm mt-1">Showing {displayCycle}</p>
                </motion.div>
              ) : (
                <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                    <Repeat className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">New week, New menu!</h2>
                  <p className="text-gray-400 mb-6 text-sm">
                    Switch to <span className="text-orange-300 font-semibold">{targetCycle}</span>?
                  </p>

                  {toggleCycleMutation.isError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mb-4 text-sm">Failed to toggle. Please try again.</motion.p>}

                  <div className="flex flex-col items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggle}
                      disabled={toggleCycleMutation.isPending}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-orange-500/25 transition-shadow disabled:opacity-50"
                    >
                      {toggleCycleMutation.isPending ? 'Switching...' : 'Toggle Menu'}
                    </motion.button>

                    <div className="flex flex-col items-center gap-1 mt-2">
                      <p className="text-gray-500 text-xs">Already matching with the mess?</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onDismiss}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
                      >
                        Not now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}

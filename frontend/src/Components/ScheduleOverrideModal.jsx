import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apiClient';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const createOrUpdateOverride = async (overrideData) => {
  const { data } = await apiClient.post('/schedule/overrides', overrideData);
  return data;
};

const fetchOverride = async (date) => {
  if (!date) return null;
  const { data } = await apiClient.get(`/schedule/overrides/${date}`);
  return data;
};

const deleteOverride = async (date) => {
  await apiClient.delete(`/schedule/overrides/${date}`);
};

export default function ScheduleOverrideModal({ onClose, currentDate }) {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const queryClient = useQueryClient();

  const { data: existingOverride, isLoading: isLoadingOverride } = useQuery({
    queryKey: ['scheduleOverride', selectedDate],
    queryFn: () => fetchOverride(selectedDate),
    enabled: !!selectedDate,
    retry: false,
  });

  useEffect(() => {
    if (existingOverride) {
      setSelectedDay(existingOverride.target_day);
    } else {
      setSelectedDay('');
    }
  }, [existingOverride, selectedDate]);
  
  const days = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['mySchedule'] });
    queryClient.invalidateQueries({ queryKey: ['scheduleOverride'] }); 
    onClose();
  };

  const saveMutation = useMutation({
    mutationFn: createOrUpdateOverride,
    onSuccess: handleMutationSuccess,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOverride,
    onSuccess: handleMutationSuccess,
  });

  const handleSave = () => {
    if (selectedDay && selectedDate) {
      saveMutation.mutate({ override_date: selectedDate, target_day: selectedDay });
    }
  };

  const handleRemove = () => {
    if (selectedDate) {
      deleteMutation.mutate(selectedDate);
    }
  };
  
  const isMutating = saveMutation.isLoading || deleteMutation.isLoading;

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
        <div className="w-full max-w-md glass rounded-3xl p-6 border border-blue-400/30 shadow-2xl neon-glow-blue max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Override Schedule</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-all"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 glass rounded-xl border border-gray-600/50 text-white focus:border-blue-400/50 focus:outline-none transition-all"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          
          <p className="text-sm text-gray-400 mb-4">
            Which day's schedule should be followed?
          </p>
          
          <div className="space-y-2 mb-6">
            {days.map((day) => (
              <motion.button
                key={day.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDay(day.value)}
                disabled={isMutating}
                className={`w-full p-3 rounded-xl text-left font-semibold transition-all disabled:opacity-50 ${
                  selectedDay === day.value
                    ? 'bg-blue-500/30 border-2 border-blue-400 text-blue-300'
                    : 'glass border border-gray-600/50 text-gray-300 hover:border-blue-400/50'
                }`}
              >
                {day.label}
              </motion.button>
            ))}
          </div>
          
          <div className="flex gap-3">
            {existingOverride && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRemove}
                disabled={isMutating}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-500/20 text-red-300 border border-red-400/50 hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                {deleteMutation.isLoading ? 'Removing...' : 'Remove Override'}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!selectedDay || isMutating}
              className="flex-1 px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              {saveMutation.isLoading ? 'Applying...' : 'Apply'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
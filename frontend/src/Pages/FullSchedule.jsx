import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FlaskConical, Calendar, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ScheduleOverrideModal from '../Components/ScheduleOverrideModal';

const fetchScheduleByDay = async (day) => {
  if (!day) return [];
  const { data } = await apiClient.get(`/schedule?day=${day}`);
  return data;
};

export default function FullSchedule() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentDayIndex = new Date().getDay();
  const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];
  
  const [activeDay, setActiveDay] = useState(currentDay);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setActiveDay(currentDay);
  }, [currentDay]);

  const { data: scheduleItems, isLoading, isError } = useQuery({
    queryKey: ['schedule', activeDay],
    queryFn: () => fetchScheduleByDay(activeDay),
    staleTime: 0,
  });

  const handleOverrideSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['mySchedule'] });
    setShowOverrideModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 glass hover:bg-gray-700/50 rounded-xl transition-all border border-gray-600/50"
              >
                <ArrowLeft className="w-6 h-6 text-gray-300" />
              </motion.button>
            </Link>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            <Calendar className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Schedule
            </h1>
          </div>

          <div className="ml-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOverrideModal(true)}
              className="px-4 py-3 rounded-xl transition-all flex items-center gap-2 glass border border-blue-400/50 hover:bg-blue-400/20 text-blue-300"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">Override</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex overflow-x-auto gap-3 mb-8 pt-2 pb-2 scrollbar-hide"
        >
          {days.map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-bold transition-all ${
                activeDay === day
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white neon-glow-blue'
                  : 'glass text-gray-300 hover:bg-gray-700/50 border border-gray-600/50'
              } ${
                day === currentDay ? 'ring-2 ring-cyan-400/50' : ''
              }`}
            >
              <span className="capitalize">{day}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {isLoading && <p className="text-center text-gray-400 pt-16">Loading schedule...</p>}
          {isError && <p className="text-center text-red-400 pt-16">Error loading schedule.</p>}
          {!isLoading && !isError && scheduleItems?.length > 0 ? (
            scheduleItems.map((item, index) => {
              const timeRange = `${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`;
              return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-6 border border-gray-600/50 hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5  flex-1 min-w-0">
                    {item.item_type === 'lab' ? (
                      <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-400/50">
                        <FlaskConical className="w-8 h-8 text-orange-400" />
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/50">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                          <h3 className="text-2xl font-bold text-white mb-1">{item.name}</h3>
                          <p className="text-gray-400 font-medium">{item.room}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-mono font-bold text-cyan-400 whitespace-nowrap">{item.time}</p>
                      </div>
                    </div>
              </motion.div>
            )})
          ) : (
            !isLoading && !isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 px-6 glass rounded-3xl border border-purple-400/30 neon-glow-purple"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-6"
                >
                  🎉
                </motion.div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">
                  Free Day!
                </h3>
              </motion.div>
            )
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showOverrideModal && (
          <ScheduleOverrideModal
            onClose={() => setShowOverrideModal(false)}
            onSuccess={handleOverrideSuccess}
            currentDate={format(new Date(), 'yyyy-MM-dd')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
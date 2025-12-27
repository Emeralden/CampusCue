import React from 'react';
import { ArrowLeft, BookOpen, FlaskConical, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import apiClient from '@/apiClient';
import { motion } from 'framer-motion';

const fetchScheduleByDay = async (day) => {
  if (!day) return [];
  const { data } = await apiClient.get(`/schedule?day=${day}`);
  return data;
};

export default function FullSchedule() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentDayIndex = new Date().getDay();
  const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];
  
  const [activeDay, setActiveDay] = React.useState(currentDay);

  React.useEffect(() => {
    setActiveDay(currentDay);
  }, [currentDay]);

  const { data: scheduleItems, isLoading, isError } = useQuery({
    queryKey: ['schedule', activeDay],
    queryFn: () => fetchScheduleByDay(activeDay),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to={createPageUrl("Dashboard")}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 glass hover:bg-gray-700/50 rounded-xl transition-all border border-gray-600/50"
            >
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-3">
            <Calendar className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Schedule
            </h1>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex overflow-x-auto gap-3 mb-8 pt-2 pb-2 scrollbar-hide scroll-snap-x-mandatory"
        >
          {days.map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay(day)}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-bold transition-all scroll-snap-start ${
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          {isLoading && <p className="text-center text-gray-400">Loading schedule...</p>}
          {isError && <p className="text-center text-red-400">Error loading schedule.</p>}
          {!isLoading && !isError && scheduleItems?.length > 0 ? (
            scheduleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 border border-gray-600/50 hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    {item.item_type === 'lab' ? (
                      <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-400/50">
                        <FlaskConical className="w-8 h-8 text-orange-400" />
                      </div>
                    ) : (
                      <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/50">
                        <BookOpen className="w-8 h-8 text-blue-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-gray-400 font-medium">{item.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono font-bold text-cyan-400 mb-2">{item.time}</p>
                  </div>
                </div>
              </motion.div>
            ))
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
    </div>
  );
}
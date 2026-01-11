import React from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import apiClient from '@/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const fetchFullMenu = async (cycle) => {
  const { data } = await apiClient.get(`/mess?cycle=${cycle}`);
  return data;
};

export default function FullMessMenu() {
  const [activeWeek, setActiveWeek] = React.useState('weeks_1_3');
  const [expandedDay, setExpandedDay] = React.useState(null);
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const currentDayIndex = new Date().getDay();
  const currentDay = days[currentDayIndex === 0 ? 6 : currentDayIndex - 1];

  const { data: rawMenuData, isLoading, isError } = useQuery({
    queryKey: ['fullMenu', activeWeek],
    queryFn: () => fetchFullMenu(activeWeek),
    staleTime: 5 * 60 * 1000,
  });

  const menuByDay = React.useMemo(() => {
    if (!rawMenuData) return {};
    return rawMenuData.reduce((acc, item) => {
      const { day_of_week, meal_type, description } = item;
      if (!acc[day_of_week]) {
        acc[day_of_week] = {};
      }
      acc[day_of_week][meal_type] = description;
      return acc;
    }, {});
  }, [rawMenuData]);

  React.useEffect(() => {
    setExpandedDay(currentDay);
  }, [currentDay]);

  const handleToggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">Loading Menu...</div>;
  }

  if (isError) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">Error fetching menu.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center justify-center mb-8"
        >
          <Link to={createPageUrl("Dashboard")} className="absolute -left-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 glass hover:bg-gray-700/50 rounded-xl transition-all border border-gray-600/50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </motion.button>
          </Link>
          <div className="flex items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Mess Menu
            </h1>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <div className="glass rounded-full p-2 border border-purple-400/30 neon-glow-purple">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveWeek('weeks_1_3')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeWeek === 'weeks_1_3'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white neon-glow-purple'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              1 & 3
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveWeek('weeks_2_4')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeWeek === 'weeks_2_4'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white neon-glow-purple'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              2 & 4
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          key={activeWeek}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {days.map((day, dayIndex) => {
            const menu = menuByDay[day] || {};
            const isExpanded = expandedDay === day;
            const isCurrentDay = day === currentDay;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.1 }}
                className={`glass rounded-2xl overflow-hidden border transition-all ${
                  isCurrentDay
                    ? 'border-cyan-400/50 neon-glow-blue'
                    : 'border-gray-600/50 hover:border-purple-400/50'
                }`}
              >
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
                  onClick={() => handleToggleDay(day)}
                  className="w-full p-6 text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold text-white capitalize">{day}</h2>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-7 h-7 text-gray-400" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-700/50"
                    >
                      <div className="p-6 space-y-5">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="p-4 glass rounded-xl border border-cyan-400/30"
                        >
                          <h3 className="font-bold text-cyan-300 mb-3 flex items-center gap-2 text-xl">
                            🌅 <span>Breakfast (8:00-10:00)</span>
                          </h3>
                          <p className="text-gray-200 font-medium leading-relaxed text-sm">{menu.breakfast || 'Not Available'}</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="p-4 glass rounded-xl border border-green-400/30"
                        >
                          <h3 className="font-bold text-green-300 mb-3 flex items-center gap-2 text-xl">
                            🍽️ <span>Lunch (12:30-2:30)</span>
                          </h3>
                          <p className="text-gray-200 font-medium leading-relaxed text-sm">{menu.lunch || 'Not Available'}</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="p-4 glass rounded-xl border border-rose-400/30"
                        >
                          <h3 className="font-bold text-rose-300 mb-3 flex items-center gap-2 text-xl">
                            🌙 <span>Dinner (8:00-10:00)</span>
                          </h3>
                          <div>
                            <p className="text-gray-200 font-medium leading-relaxed text-sm">{menu.dinner || 'Not Available'}</p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 glass rounded-2xl border border-gray-600/50"
        >
          <p className="text-center text-gray-400 leading-relaxed">
            <strong className="text-gray-300 text-lg">Daily Constants:</strong><br />
            <span className="text-base">Chapati, Steam Rice, Curd, Salad, Tea/Coffee/Milk, Bread+Butter+Jam, Banana</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
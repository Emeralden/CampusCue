import React, { useRef, useState } from 'react';
import { Clock, BookOpen, Utensils, Coffee, FlaskConical, Check, ChefHat, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence} from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import apiClient from '@/apiClient';
import { format } from 'date-fns';
import ScheduleOverrideModal from './ScheduleOverrideModal';

const MEAL_TIMES = {
  breakfast: { start: 8, end: 10 },
  lunch: { start: 12.5, end: 14.5 },
  dinner: { start: 20, end: 22 }
};

const fetchMyMenu = async (dateStr) => {
  const { data } = await apiClient.get(`/mess/my-menu?date=${dateStr}`);
  return data;
};

const fetchMySchedule = async (dateStr) => {
  const { data } = await apiClient.get(`/schedule/my-day?date=${dateStr}`);
  return data;
};

export default function DayOverviewContent({ dayOffset = 0, showTimeAndStatus = true }) {
  const [now, setNow] = React.useState(new Date());
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const holdTimeout = useRef(null);

  const targetDate = new Date(now);
  targetDate.setDate(targetDate.getDate() + dayOffset);
  const dateStr = format(targetDate, 'yyyy-MM-dd');

  const { data: menuData, isLoading: isMenuLoading, isError: isMenuError } = useQuery({
    queryKey: ['myMenu', dateStr],
    queryFn: () => fetchMyMenu(dateStr),
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  const { data: scheduleData, isLoading: isScheduleLoading, isError: isScheduleError } = useQuery({
    queryKey: ['mySchedule', dateStr],
    queryFn: () => fetchMySchedule(dateStr),
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleCycle = () => {
    if (!menuData) return;
    const newCycle = menuData.cycle === 'weeks_1_3' ? 'weeks_2_4' : 'weeks_1_3';
    messPreferenceMutation.mutate({ mess_cycle: newCycle });
  };
  
  const handleHoldStart = () => {
    holdTimeout.current = setTimeout(() => navigate(createPageUrl("SatisfactionCalendar")), 500);
  };

  const handleHoldEnd = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  const handleMenuSwipe = (event, info) => {
    if (info.offset.x < -100) navigate(createPageUrl("FullMessMenu"));
  };

  const handleScheduleSwipe = (event, info) => {
    if (info.offset.x < -100) navigate(createPageUrl("FullSchedule"));
  };

  const getCurrentHour = () => now.getHours() + now.getMinutes() / 60;

  const getTimeStatus = (startTimeStr, endTimeStr) => {
    if (!showTimeAndStatus || !startTimeStr || !endTimeStr) return 'upcoming';
    
    const [startHour, startMin] = startTimeStr.split(':').map(Number);
    const [endHour, endMin] = endTimeStr.split(':').map(Number);

    const startDecimal = startHour + (startMin || 0) / 60;
    const endDecimal = endHour + (endMin || 0) / 60;
    const current = getCurrentHour();

    if (current >= endDecimal) return 'completed';
    if (current >= startDecimal) return 'ongoing';
    return 'upcoming';
  };

  const getMealStatus = (meal) => {
    if (!showTimeAndStatus) return 'upcoming';
    const current = getCurrentHour();
    const { start, end } = MEAL_TIMES[meal];
    if (current >= end) return 'completed';
    if (current >= start) return 'ongoing';
    return 'upcoming';
  };
  
  const getStatusStyles = (status, type) => {
    if (type === 'meal') {
      switch (status) {
        case 'completed': return { bg: 'glass border-green-400/50', text: 'text-green-300', badge: 'bg-green-500/30 text-green-300 border border-green-400/50 w-20' };
        case 'ongoing': return { bg: 'glass border-yellow-400/50 animated-active-border-yellow', text: 'text-yellow-300', badge: 'bg-yellow-500/30 text-yellow-300 animate-pulse border border-yellow-400/50 w-20' };
        case 'upcoming': return { bg: 'glass border-purple-400/50', text: 'text-purple-300', badge: 'bg-purple-500/30 text-purple-300 border border-purple-400/50 w-20' };
      }
    }
    switch (status) {
      case 'completed': return { bg: 'glass border-green-400/50', text: 'text-green-300', badge: 'bg-green-500/30 text-green-300 border border-green-400/50 w-16' };
      case 'ongoing': return { bg: 'glass border-cyan-400/50 animated-active-border-blue', text: 'text-cyan-300', badge: 'bg-cyan-500/30 text-cyan-300 animate-pulse border border-cyan-400/50 w-16' };
      case 'upcoming': return { bg: 'glass border-purple-400/50', text: 'text-purple-300', badge: 'bg-purple-500/30 text-purple-300 border border-purple-400/50 w-16' };
      default: return { bg: 'glass border-gray-400/50', text: 'text-gray-300', badge: 'bg-gray-500/30 text-gray-300 border border-gray-400/50 w-16' };
    }
  };

  if (isMenuLoading || isScheduleLoading) {
    return <div className="text-center text-gray-400 p-8">Loading Overview...</div>;
  }

  if (isMenuError || isScheduleError) {
    return <div className="text-center text-red-400 p-8">Error fetching daily overview. Please try again later.</div>;
  }
  
  const scheduleWithStatus = scheduleData?.map(item => ({
    ...item,
    status: getTimeStatus(item.start_time, item.end_time)
  })) || [];

  const meals = [
    { name: 'Breakfast', time: '8:00-10:00', icon: Coffee, status: getMealStatus('breakfast'), item: menuData?.meals?.breakfast },
    { name: 'Lunch', time: '12:30-2:30', icon: Utensils, status: getMealStatus('lunch'), item: menuData?.meals?.lunch },
    { name: 'Dinner', time: '8:00-10:00', icon: ChefHat, status: getMealStatus('dinner'), item: menuData?.meals?.dinner }
  ];

  return (
    <div className="space-y-8">
      {showTimeAndStatus && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center cursor-pointer" onMouseDown={handleHoldStart} onMouseUp={handleHoldEnd} onMouseLeave={handleHoldEnd} onTouchStart={handleHoldStart} onTouchEnd={handleHoldEnd}>
          <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full border border-cyan-400/30 neon-glow-blue">
            <Clock className="w-6 h-6 text-cyan-400" />
            <span className="text-2xl font-mono font-bold text-cyan-300">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleMenuSwipe} whileDrag={{ scale: 1.02 }} className="space-y-6 cursor-grab active:cursor-grabbing">
        <div className="text-center mb-6 relative">
          <h2 className="text-[1.7rem] font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent inline-block">
            {dayOffset === 0 ? "Today's Menu" : "Tomorrow's Menu"}
          </h2>
          <Link to="/mess-menu" className="absolute top-1/2 -translate-y-1/2 ml-2">
            <motion.div whileHover={{ scale: 1.1, rotate: 45 }} className="text-orange-400 mt-[7%]">
              <ExternalLink className="w-5 h-5" />
            </motion.div>
          </Link>
        </div>
        <div className="grid gap-4">
          {meals.map((meal, index) => {
            const IconComponent = meal.icon;
            const styles = getStatusStyles(meal.status, 'meal');
            return (
              <motion.div key={meal.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`p-6 rounded-2xl transition-all ${styles.bg}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <IconComponent className={`w-7 h-7 mt-1 flex-shrink-0 ${styles.text}`} />
                    <div>
                      <h3 className={`text-2xl font-semibold ${styles.text}`}>{meal.name}</h3>
                      <p className="text-gray-400 font-medium mb-2">{meal.time}</p>
                      {meal.item && (<div><p className="text-gray-200 font-medium leading-relaxed text-lg">{meal.item}</p></div>)}
                    </div>
                  </div>
                  {showTimeAndStatus && meal.status !== 'upcoming' && (<div className={`flex items-center justify-center flex-shrink-0 px-4 py-2 rounded-full text-base font-bold uppercase tracking-wide ${styles.badge}`}>{meal.status === 'completed' ? "Burp!" : "Serving"}</div>)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {scheduleWithStatus.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleScheduleSwipe} whileDrag={{ scale: 1.02 }} className="space-y-6 cursor-grab active:cursor-grabbing">
          <div className="text-center mb-6 relative">
            <h2 className="text-[1.7rem] font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent inline-block">
              {dayOffset === 0 ? "Today's Schedule" : "Tomorrow's Schedule"}
            </h2>
            <Link to="/schedule" className="absolute top-1/2 -translate-y-1/2 ml-2">
              <motion.div whileHover={{ scale: 1.1, rotate: 45 }} className="text-blue-400 mt-[7%]">
                <ExternalLink className="w-5 h-5" />
              </motion.div>
            </Link>
          </div>
          {scheduleData?.has_override && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center p-3 glass rounded-xl border border-orange-400/50">
              <p className="text-orange-300 font-semibold text-sm">Following {scheduleData.schedule_day.charAt(0).toUpperCase() + scheduleData.schedule_day.slice(1)}'s schedule</p>
            </motion.div>
          )}
          <div className="grid gap-4">
            {scheduleWithStatus.map((item, index) => {
              const styles = getStatusStyles(item.status, 'class');
              const timeRange = `${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className={`p-6 rounded-2xl ${styles.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.item_type === 'lab' ? (<FlaskConical className="w-7 h-7 text-orange-400" />) : (<BookOpen className={`w-7 h-7 ${styles.text}`} />)}
                      <div>
                        <h3 className={`text-2xl font-semibold ${styles.text}`}>{item.name}</h3>
                        <p className="text-gray-300 font-medium text-lg">{item.room}</p>
                        <p className="text-gray-300/90 font-medium text-lg">{timeRange}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {showTimeAndStatus && item.status !== 'upcoming' && (<div className={`flex items-center justify-center flex-shrink-0 px-4 py-2 rounded-full text-base font-bold uppercase tracking-wide ${styles.badge}`}>{item.status === 'completed' ? (<Check className="w-5 h-5" />) : ("Live")}</div>)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {scheduleWithStatus.length === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleScheduleSwipe} whileDrag={{ scale: 1.02 }} className="text-center py-12 px-6 rounded-3xl glass border border-purple-400/30 neon-glow-purple cursor-grab active:cursor-grabbing">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl mb-6">🎉</motion.div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3">Free Day!</h3>
        </motion.div>
      )}

      <AnimatePresence>
        {showOverrideModal && (<ScheduleOverrideModal onClose={() => setShowOverrideModal(false)} currentDate={dateStr} />)}
      </AnimatePresence>

      {dayOffset === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center pt-1">
          <Link to="/tomorrow" className="text-lg font-semibold text-purple-400 hover:text-purple-300 transition-colors">
            Peek Tomorrow 👀 →
          </Link>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center pt-7"
      >
        <p className="text-sm font-semibold text-gray-600 tracking-wider">
          Powered by Bhargav ⚡️
        </p>
      </motion.div>
    </div>
  );
}
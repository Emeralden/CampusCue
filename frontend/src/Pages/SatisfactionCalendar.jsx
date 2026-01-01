import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apiClient';
import SatisfactionModal from '../Components/SatisfactionModal';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const EMOJI_DETAILS = {
  "😄": { color: "green", label: "Very Satisfied", value: 5 },
  "🙂": { color: "blue", label: "Satisfied", value: 4 },
  "😐": { color: "yellow", label: "Neutral", value: 3 },
  "🙁": { color: "orange", label: "Dissatisfied", value: 2 },
  "😞": { color: "red", label: "Very Dissatisfied", value: 1 }
};

const EMOJI_BG_COLORS = {
  "😄": "bg-green-500/30 border-green-300/70",
  "🙂": "bg-blue-500/30 border-blue-300/70",
  "😐": "bg-yellow-500/30 border-yellow-300/70",
  "🙁": "bg-orange-500/30 border-orange-400/50",
  "😞": "bg-red-500/30 border-red-400/50"
};

const PIE_COLORS = {
  "😄": "#22c55e",
  "🙂": "#3b82f6",
  "😐": "#eab308",
  "🙁": "#f97316",
  "😞": "#ef4444"
};

const fetchSatisfactionHistory = async () => {
  const { data } = await apiClient.get('/satisfaction/history');
  return data;
};

export default function SatisfactionCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingDate, setEditingDate] = useState(null);
  const queryClient = useQueryClient();

  const { data: satisfactionLogs, isLoading, isError } = useQuery({
    queryKey: ['satisfactionHistory'],
    queryFn: fetchSatisfactionHistory,
  });

  const satisfactionDataMap = useMemo(() => {
    if (!satisfactionLogs) return {};
    return satisfactionLogs.reduce((acc, record) => {
      acc[record.log_date] = record.satisfaction_level;
      return acc;
    }, {});
  }, [satisfactionLogs]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayIndex = getDay(monthStart) === 0 ? 6 : getDay(monthStart) - 1;
  const blanks = Array(startingDayIndex).fill(null);
  const calendarDays = [...blanks, ...daysInMonth];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthLogs = useMemo(() => {
    if (!satisfactionLogs) return [];
    const monthStr = format(currentMonth, 'yyyy-MM');
    return satisfactionLogs.filter(log => log.log_date.startsWith(monthStr));
  }, [satisfactionLogs, currentMonth]);

  const averageMonthlyScore = useMemo(() => {
    if (monthLogs.length === 0) return null;
    const sum = monthLogs.reduce((acc, log) => acc + (EMOJI_DETAILS[log.satisfaction_level]?.value || 0), 0);
    return (sum / monthLogs.length).toFixed(1);
  }, [monthLogs]);

  const pieChartData = useMemo(() => {
    const summary = Object.keys(EMOJI_DETAILS).reduce((acc, emoji) => ({ ...acc, [emoji]: 0 }), {});
    monthLogs.forEach(log => {
      if (summary.hasOwnProperty(log.satisfaction_level)) {
        summary[log.satisfaction_level]++;
      }
    });
    return Object.entries(summary)
      .filter(([, count]) => count > 0)
      .map(([emoji, count]) => ({
        name: emoji,
        value: count,
        label: EMOJI_DETAILS[emoji].label
      }));
  }, [monthLogs]);

  const getScoreColor = (score) => {
    if (!score) return 'from-gray-400 to-gray-500';
    const numScore = parseFloat(score);
    if (numScore >= 4.5) return 'from-green-400 to-green-600';
    if (numScore >= 3.5) return 'from-blue-400 to-blue-600';
    if (numScore >= 2.5) return 'from-yellow-400 to-yellow-600';
    if (numScore >= 1.5) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const handleDayClick = (day) => setEditingDate(format(day, 'yyyy-MM-dd'));
  const handleCancelEdit = () => setEditingDate(null);
  const handleMoodUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['satisfactionHistory'] });
    setEditingDate(null);
  };

  if (isLoading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">Loading Hustle Meter...</div>;
  if (isError) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-400">Error fetching history.</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center mb-10 relative">
          <Link to={createPageUrl("Dashboard")} className="absolute left-0">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 glass hover:bg-gray-700/50 rounded-xl transition-all border border-gray-600/50">
              <ArrowLeft className="w-6 h-6 text-gray-300" />
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Hustle Meter</h1>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6 md:p-8 border border-gray-700 space-y-6">
          <div className="flex items-center justify-between">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-700/50">
              <ChevronLeft className="w-6 h-6 text-gray-300" />
            </motion.button>
            <h2 className="text-2xl font-bold text-white text-center">{format(currentMonth, 'MMMM yyyy')}</h2>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-gray-700/50">
              <ChevronRight className="w-6 h-6 text-gray-300" />
            </motion.button>
          </div>

          <motion.div key={currentMonth.toString()} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => <div key={day} className="text-center font-bold text-gray-400 pb-2 text-sm">{day}</div>)}
            {calendarDays.map((day, index) => {
              if (!day) return <div key={`blank-${index}`} />;
              const dayStr = format(day, 'yyyy-MM-dd');
              const emoji = satisfactionDataMap[dayStr];
              const bgColor = emoji ? EMOJI_BG_COLORS[emoji] : "bg-gray-800/20";
              const isClickable = "cursor-pointer hover:scale-105";

              return (
                <motion.div
                  key={dayStr}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index - startingDayIndex) * 0.02 }}
                  onClick={() => handleDayClick(day)}
                  className={`relative aspect-square rounded-lg border transition-all ${isToday(day) ? 'border-cyan-400/80 neon-glow-blue' : 'border-gray-700/50'} ${bgColor} ${isClickable}`}>
                  <span className={`absolute top-1.5 left-2 font-bold text-xs md:text-sm ${isToday(day) ? 'text-cyan-300' : 'text-gray-400'}`}>{format(day, 'd')}</span>
                  {emoji && <motion.span key={`emoji-${emoji}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }} className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl">{emoji}</motion.span>}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {pieChartData.length > 0 &&
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-3xl p-6 md:p-8 border border-gray-700 space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-7 h-7 text-purple-400" />
              <h2 className="text-3xl font-bold text-white text-center">Insights</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 glass rounded-2xl border border-purple-400/30">
                <p className="text-gray-400 text-sm font-medium mb-2">Average Monthly Score</p>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor(averageMonthlyScore)} bg-clip-text text-transparent`}>{averageMonthlyScore || '--'}</motion.div>
                <p className="text-gray-500 text-xs mt-2">out of 5.0</p>
              </div>

              <div className="p-4 glass rounded-2xl border border-purple-400/30">
                <p className="text-gray-400 text-sm font-medium mb-2 text-center">Mood Distribution</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                      {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', color: '#fff' }} formatter={(value, name, props) => [`${value} days`, props.payload.name]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-3">
                  {pieChartData.map((entry) => <div key={entry.name} className="flex items-center gap-2"><span className="text-xl">{entry.name}</span><span className="text-sm text-gray-400">{entry.value}</span></div>)}
                </div>
              </div>
            </div>
          </motion.div>
        }
      </div>

      <AnimatePresence>
        {editingDate &&
          <SatisfactionModal
            date={editingDate}
            currentMood={satisfactionDataMap[editingDate]}
            onSuccess={handleMoodUpdated}
            onCancel={handleCancelEdit} />
        }
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import TimeBasedGreeting from '../Components/TimeBasedGreeting';
import CurrentDayOverview from '../Components/CurrentDayOverview';
import SatisfactionModal from '../Components/SatisfactionModal';
import apiClient from '@/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

const fetchSatisfactionHistory = async () => {
  const { data } = await apiClient.get('/satisfaction/history');
  return data;
};

export default function Dashboard() {
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  const [promptDate, setPromptDate] = useState(null);
  const queryClient = useQueryClient();

  const { data: allLogs, isLoading, isError } = useQuery({
    queryKey: ['satisfactionHistory'],
    queryFn: fetchSatisfactionHistory,
    refetchInterval: 2 * 60 * 1000,
  });

  useEffect(() => {
  if (!allLogs || allLogs.length === 0) return;

    const checkForMissedMoodLogs = () => {
      try {
        const now = new Date();
        const currentHour = now.getHours();
        
        const todayStr = format(now, 'yyyy-MM-dd');
        const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
        
        const loggedDates = new Set(allLogs.map(log => log.log_date));
        
        if (currentHour >= 22 && !loggedDates.has(todayStr)) {
          setPromptDate(todayStr);
          setShowSatisfactionModal(true);
          return;
        }
        
        if (!loggedDates.has(yesterdayStr)) {
          setPromptDate(yesterdayStr);
          setShowSatisfactionModal(true);
          return;
        }

      } catch (error) {
        console.error('Error processing mood logs:', error);
      }
    };

    checkForMissedMoodLogs();
  }, [allLogs]);

  const handleMoodLogged = () => {
    setShowSatisfactionModal(false);
    setPromptDate(null);
    queryClient.invalidateQueries({ queryKey: ['satisfactionHistory'] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading Dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400">Could not connect to the server.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-10">
        <TimeBasedGreeting />
        <CurrentDayOverview />
      </div>
      <AnimatePresence>
        {showSatisfactionModal && promptDate && (
          <SatisfactionModal 
            date={promptDate}
            onSuccess={handleMoodLogged}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
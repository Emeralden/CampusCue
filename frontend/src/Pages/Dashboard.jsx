import React, { useState, useEffect } from 'react';
import Greeting from '../Components/Greeting';
import CurrentDayOverview from '../Components/CurrentDayOverview';
import SatisfactionModal from '../Components/SatisfactionModal';
import CycleToggleReminderModal from '../Components/CycleToggleReminderModal';
import UserHub from '../Components/UserHub.jsx';
import apiClient from '@/apiClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format, subDays, startOfWeek } from 'date-fns';
import { AnimatePresence } from 'framer-motion';

const fetchSatisfactionHistory = async () => {
  const { data } = await apiClient.get('/satisfaction/history');
  return data;
};

export default function Dashboard() {
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);
  const [promptDate, setPromptDate] = useState(null);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
  queryKey: ['currentUser'],
  queryFn: async () => (await apiClient.get('/users/me')).data,
  });

  const { data: allLogs, isLoading, isError } = useQuery({
    queryKey: ['satisfactionHistory'],
    queryFn: fetchSatisfactionHistory,
    refetchInterval: 2 * 60 * 1000,
  });

  useEffect(() => {
  if (!currentUser || !currentUser.enable_satisfaction_prompt) return;
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
  }, [allLogs, currentUser]);

  const [showCycleReminder, setShowCycleReminder] = useState(false);
  const [cycleReminderIsAuto, setCycleReminderIsAuto] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const now = new Date();
    const currentMonday = startOfWeek(now, { weekStartsOn: 1 });
    const currentMondayStr = format(currentMonday, 'yyyy-MM-dd');

    const storedMondayStr = localStorage.getItem('cycleReminderMonday');

    if (storedMondayStr === currentMondayStr) return;

    if (storedMondayStr) {
      const prevMonday = subDays(currentMonday, 7);
      const prevMondayStr = format(prevMonday, 'yyyy-MM-dd');
      if (storedMondayStr !== prevMondayStr) return;
    }

    setCycleReminderIsAuto(true);
    setShowCycleReminder(true);
  }, [currentUser]);

  const dismissCycleReminder = () => {
    if (cycleReminderIsAuto) {
      const now = new Date();
      const currentMonday = startOfWeek(now, { weekStartsOn: 1 });
      localStorage.setItem('cycleReminderMonday', format(currentMonday, 'yyyy-MM-dd'));
    }
    setCycleReminderIsAuto(false);
    setShowCycleReminder(false);
  };

  const handleCycleToggled = () => {
    dismissCycleReminder();
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  const handleManualToggle = () => {
    setCycleReminderIsAuto(false);
    setShowCycleReminder(true);
  };

  const handleMoodLogged = () => {
    setShowSatisfactionModal(false);
    setPromptDate(null);
    queryClient.invalidateQueries({ queryKey: ['satisfactionHistory'] });
  };

  const handleCancelPrompt = () => {
  setShowSatisfactionModal(false);
  setPromptDate(null);
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
    <div className="min-h-screen bg-gray-900 px-4 py-8 relative">
      <div className="absolute top-2 left-2 z-10">
        <UserHub onToggleMenu={handleManualToggle} />
      </div>
      <div className="max-w-2xl mx-auto space-y-10">
        <Greeting />
        <CurrentDayOverview />
      </div>
      <AnimatePresence>
        {showSatisfactionModal && promptDate && (
          <SatisfactionModal
            date={promptDate}
            onSuccess={handleMoodLogged}
            onCancel={handleCancelPrompt}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCycleReminder && !showSatisfactionModal && currentUser && (
          <CycleToggleReminderModal
            currentCycle={currentUser.mess_cycle}
            onToggled={handleCycleToggled}
            onDismiss={dismissCycleReminder}
            autoToggle={!cycleReminderIsAuto}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
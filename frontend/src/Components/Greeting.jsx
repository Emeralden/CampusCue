import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Greeting() {
  const [greeting, setGreeting] = React.useState('');
  const [icon, setIcon] = React.useState("🏖️");
  const navigate = useNavigate();

  const GREETINGS_BY_DAY = {
    0: { greeting: "Holidayyy!", emoji: "🏖️" },
    1: { greeting: "Back to it!", emoji: "😭" },
    2: { greeting: "Still alive", emoji: "😌" },
    3: { greeting: "Halfway...", emoji: "😮‍💨" },
    4: { greeting: "Ufffff!", emoji: "🥶" },
    5: { greeting: "Final rush!", emoji: "⏳" },
    6: { greeting: "Peace", emoji: "🕊️" },
  };

  React.useEffect(() => {
    const dayIndex = new Date().getDay();
    const { greeting, emoji } = GREETINGS_BY_DAY[dayIndex];
    setGreeting(greeting);
    setIcon(emoji);
  }, []);

  const handleSwipeLeft = (event, info) => {
    if (info.offset.x < -100) {
      navigate(createPageUrl("TomorrowOverview"));
    }
  };

  const IconComponent = icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <div className="flex items-center justify-center gap-1 mb-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          className="text-[2.6rem] mb-4 mt-3"
        >
          {icon}
        </motion.div>
        <h1 className="text-[2.6rem] md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-relaxed py-4">
          {greeting}
        </h1>
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleSwipeLeft}
        whileDrag={{ scale: 1.05 }}
        className="cursor-grab active:cursor-grabbing"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-gray-400 text-[1.2rem] font-medium group hover:text-gray-300 transition-colors"
        >
          <span>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
import React from 'react';
import { Sun, CloudSnow, Sunset, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import UserHub from './UserHub';

export default function TimeBasedGreeting() {
  const [greeting, setGreeting] = React.useState('');
  const [icon, setIcon] = React.useState(Sun);
  const navigate = useNavigate();

  React.useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good Morning!');
        setIcon(Sun);
      } else if (hour >= 12 && hour < 16) {
        setGreeting('Good Afternoon!'); 
        setIcon(CloudSnow);
      } else if (hour >= 16 && hour < 19) {
        setGreeting('Good Evening!');
        setIcon(Sunset);
      } else {
        setGreeting('Good Night!');
        setIcon(Moon);
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
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
      className="text-center mb-12 relative"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <IconComponent className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-relaxed py-4">
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
          className="flex items-center justify-center gap-2 text-gray-400 text-lg font-medium group hover:text-gray-300 transition-colors"
        >
          <span>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>

          <div className="absolute top-0 left-0">
            <UserHub />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
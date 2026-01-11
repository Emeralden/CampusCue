import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apiClient';
import { Check, AlertTriangle } from 'lucide-react';

const fetchElectives = async () => {
  const { data } = await apiClient.get('/schedule/electives');
  return data;
};

const saveSubscriptions = async (schedule_item_ids) => {
  const { data } = await apiClient.post('/schedule/subscriptions', { schedule_item_ids });
  return data;
};

export default function CourseSelection({ onComplete }) {
  const { data: allCourses, isLoading } = useQuery({ queryKey: ['electives'], queryFn: fetchElectives });
  const [selectedIds, setSelectedIds] = useState([]);
  const [clashError, setClashError] = useState(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: saveSubscriptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySchedule'] });
      if (onComplete) onComplete();
    },
    onError: (error) => {
      setClashError(error.response?.data?.detail || "An error occurred.");
    }
  });

  const groupedCourses = useMemo(() => {
    if (!allCourses) return {};
    return allCourses.reduce((acc, course) => {
        if (!acc[course.name]) {
        acc[course.name] = {
            details: { name: course.name, room: course.room, type: course.course_type },
            items: []
        };
        }
        acc[course.name].items.push(course);
        return acc;
    }, {});
    }, [allCourses]);

  const detectClash = (newCourse) => {
    const selectedCourses = allCourses.filter(c => selectedIds.includes(c.id));
    for (const existingCourse of selectedCourses) {
      if (newCourse.day_of_week === existingCourse.day_of_week) {
        const newStart = newCourse.start_time;
        const newEnd = newCourse.end_time;
        const existingStart = existingCourse.start_time;
        const existingEnd = existingCourse.end_time;
        if (newStart < existingEnd && newEnd > existingStart) {
          return `Clash detected with ${existingCourse.name}!`;
        }
      }
    }
    return null;
  };

  const handleSelect = (courseName) => {
    setClashError(null);
    const courseGroup = groupedCourses[courseName];
    const allItemIds = courseGroup.items.map(item => item.id);
    const isFullySelected = allItemIds.every(id => selectedIds.includes(id));

    if (isFullySelected) {
        setSelectedIds(selectedIds.filter(id => !allItemIds.includes(id)));
    } else {
        for (const item of courseGroup.items) {
        const clash = detectClash(item);
        if (clash) {
            setClashError(clash);
            return;
        }
        }
        setSelectedIds([...new Set([...selectedIds, ...allItemIds])]);
    }
    };

  const handleSubmit = () => {
    mutation.mutate(selectedIds);
  };

  if (isLoading) return <p className="text-gray-400">Loading courses...</p>;

  return (
    <div className="w-full">
        {Object.values(groupedCourses).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {Object.values(groupedCourses).map(courseGroup => {
            const { details, items } = courseGroup;
            const allItemIds = items.map(item => item.id);
            const isSelected = allItemIds.every(id => selectedIds.includes(id));

            return (
                <motion.div
                key={details.name}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleSelect(details.name)}
                className={`relative p-4 glass rounded-xl cursor-pointer border-2 transition-all ${isSelected ? 'border-cyan-400 neon-glow-blue' : 'border-gray-600/50'}`}
                >
                <h4 className="font-bold text-white text-lg">{details.name}</h4>
                <p className="text-sm text-gray-400">{details.room} • {items.length} slot(s)</p>
                {isSelected && <Check className="absolute top-3 right-3 w-5 h-5 text-cyan-400" />}
                </motion.div>
            );
            })}
        </div>
        ) : (
        <p className="text-gray-400 text-center my-8">No elective courses available to select.</p>
        )}

      <AnimatePresence>
        {clashError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 p-3 my-4 glass rounded-xl border border-red-400/50 bg-red-500/10">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{clashError}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={handleSubmit}
        disabled={mutation.isLoading}
        className="w-full py-4 mt-8 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50"
      >
        {mutation.isLoading ? 'Saving...' : 'Confirm my courses'}
      </motion.button>
    </div>
  );
}
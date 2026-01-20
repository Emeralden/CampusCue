import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Drumstick, Egg, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/apiClient';

const updateUserDiet = async (diet) => {
  const { data } = await apiClient.patch('/users/me/profile', { diet_type: diet });
  return data;
};

export default function DietaryChoice({
  currentUser,
  currentChoice,
  onSelect,
  isLoading = false,
  onComplete,
  showButton = false,
}) {
  const queryClient = useQueryClient();
  const isControlled = typeof onSelect === 'function' || currentChoice !== undefined;
  const effectiveCurrentChoice = currentUser?.diet_type ?? currentChoice ?? null;
  const [localSelection, setLocalSelection] = React.useState(effectiveCurrentChoice);
  const hasInteractedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasInteractedRef.current) {
      setLocalSelection(effectiveCurrentChoice);
    }
  }, [effectiveCurrentChoice]);

  const mutation = useMutation({
    mutationFn: updateUserDiet,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['currentUser'], updatedUser);
      hasInteractedRef.current = false;
      setLocalSelection(updatedUser?.diet_type ?? effectiveCurrentChoice);
      if (showButton && onComplete) {
        onComplete();
      }
    },
  });

  const saving = Boolean(isLoading || mutation.isLoading || mutation.isPending);

  const handleSelect = (diet) => {
    hasInteractedRef.current = true;
    setLocalSelection(diet);

    if (!showButton) {
      if (isControlled) {
        if (diet !== effectiveCurrentChoice) onSelect?.(diet);
        return;
      }

      if (!currentUser) return;
      if (diet !== currentUser.diet_type) mutation.mutate(diet);
    }
  };
  
  const handleSubmit = () => {
    if (isControlled) {
      if (localSelection !== effectiveCurrentChoice) onSelect?.(localSelection);
      if (onComplete) onComplete();
      return;
    }

    if (!currentUser) return;
    if (localSelection !== currentUser.diet_type) mutation.mutate(localSelection);
    else if (onComplete) onComplete();
  };

  const activeDiet = localSelection; 

  return (
    <>
      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => handleSelect('veg')}
          className={`relative p-4 flex items-center gap-4 glass rounded-xl cursor-pointer border-2 transition-all ${activeDiet === 'veg' ? 'border-green-400 neon-glow-green' : 'border-gray-600/50'}`}
        >
          <Leaf className="w-8 h-8 text-green-400 flex-shrink-0" />
          <h3 className="text-lg font-bold text-white">Vegetarian</h3>
          {activeDiet === 'veg' && <CheckCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-green-400" />}
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => handleSelect('egg')}
          className={`relative p-4 flex items-center gap-4 glass rounded-xl cursor-pointer border-2 transition-all ${activeDiet === 'egg' ? 'border-yellow-400 neon-glow-yellow' : 'border-gray-600/50'}`}
        >
          <Egg className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <h3 className="text-lg font-bold text-white">Eggetarian</h3>
          {activeDiet === 'egg' && <CheckCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-yellow-400" />}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => handleSelect('non_veg')}
          className={`relative p-4 flex items-center gap-4 glass rounded-xl cursor-pointer border-2 transition-all ${activeDiet === 'non_veg' ? 'border-orange-400 neon-glow-orange' : 'border-gray-600/50'}`}
        >
          <Drumstick className="w-8 h-8 text-orange-400 flex-shrink-0" />
          <h3 className="text-lg font-bold text-white">Non-Vegetarian</h3>
          {activeDiet === 'non_veg' && <CheckCircle className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-orange-400" />}
        </motion.div>
      </div>

      {showButton && (
        <motion.button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 mt-8 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {saving ? 'Saving...' : 'Continue →'}
        </motion.button>
      )}
    </>
  );
}
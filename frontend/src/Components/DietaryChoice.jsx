import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Drumstick, CheckCircle } from 'lucide-react';
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
      <div className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} onClick={() => handleSelect('veg')} className={`relative p-6 glass rounded-2xl cursor-pointer border-2 transition-all ${activeDiet === 'veg' ? 'border-green-400 neon-glow-green' : 'border-gray-600/50'}`}>
          <Leaf className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white text-center">Veggie</h3>
          {activeDiet === 'veg' && <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-green-400" />}
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} onClick={() => handleSelect('non_veg')} className={`relative p-6 glass rounded-2xl cursor-pointer border-2 transition-all ${activeDiet === 'non_veg' ? 'border-orange-400 neon-glow-orange' : 'border-gray-600/50'}`}>
          <Drumstick className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white text-center">Meat</h3>
          {activeDiet === 'non_veg' && <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-orange-400" />}
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
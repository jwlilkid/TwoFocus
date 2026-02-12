import React from 'react';
import { RankingCriteria } from '../types';
import { ArrowUpNarrowWide, Zap, Brain, Tags } from 'lucide-react';

interface RankingSelectorProps {
  currentRanking: RankingCriteria;
  onRankingChange: (criteria: RankingCriteria) => void;
}

export const RankingSelector: React.FC<RankingSelectorProps> = ({ 
  currentRanking, 
  onRankingChange 
}) => {
  const options = [
    { id: RankingCriteria.PRIORITY, label: 'Priority', icon: <ArrowUpNarrowWide size={16} /> },
    { id: RankingCriteria.BOTHERED, label: 'Bothered', icon: <Zap size={16} /> },
    { id: RankingCriteria.DIFFICULTY, label: 'Difficulty', icon: <Brain size={16} /> },
    { id: RankingCriteria.CATEGORY, label: 'Category', icon: <Tags size={16} /> },
  ];

  return (
    <div className="bg-white dark:bg-memphis-dark-surface border-2 border-black dark:border-white shadow-memphis mb-6 p-4 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold text-lg flex items-center gap-2 text-black dark:text-white">
           Sort Tasks By:
        </span>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onRankingChange(option.id)}
              className={`
                flex items-center gap-2 px-3 py-2 border-2 border-black dark:border-white font-medium text-sm transition-all
                ${currentRanking === option.id 
                  ? 'bg-memphis-pink dark:bg-pink-700 text-black dark:text-white shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] translate-x-[-1px] translate-y-[-1px]' 
                  : 'bg-white dark:bg-black text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900'
                }
              `}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
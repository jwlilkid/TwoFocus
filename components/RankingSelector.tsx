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
    <div className="bg-white border-2 border-black shadow-memphis p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-bold text-lg flex items-center gap-2">
           Sort Tasks By:
        </span>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => onRankingChange(option.id)}
              className={`
                flex items-center gap-2 px-3 py-2 border-2 border-black font-medium text-sm transition-all
                ${currentRanking === option.id 
                  ? 'bg-memphis-pink shadow-[2px_2px_0px_0px_#1a1a1a] translate-x-[-1px] translate-y-[-1px]' 
                  : 'bg-white hover:bg-gray-50'
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
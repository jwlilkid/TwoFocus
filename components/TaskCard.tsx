import React from 'react';
import { Task } from '../types';
import { Check, Edit2, Zap, Brain, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isTopTask?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete, isTopTask }) => {
  // Dynamic background based on priority (0-10)
  const getBgColor = () => {
    if (!isTopTask) return 'bg-white dark:bg-memphis-dark-surface'; // Backup tasks need dark bg in dark mode
    if (task.priority >= 8) return 'bg-red-100 dark:bg-red-900/40';
    if (task.priority >= 5) return 'bg-memphis-yellow dark:bg-yellow-600/80';
    return 'bg-memphis-mint dark:bg-cyan-900/60';
  };

  // Text color logic: If it's a backup task in dark mode, text is white. 
  // If it's a top task (colored), text needs to be readable. 
  const getTextColor = () => {
      if (!isTopTask) return 'text-black dark:text-white';
      return 'text-black dark:text-white'; // Keep text consistent
  };

  return (
    <div 
      className={`
        relative border-2 border-black dark:border-white p-5 transition-all group
        ${isTopTask ? 'shadow-memphis hover:shadow-memphis-hover transform hover:-translate-y-1' : 'shadow-sm dark:shadow-none opacity-80 hover:opacity-100'}
        ${getBgColor()}
        ${getTextColor()}
      `}
    >
      {/* Category Tag Badge */}
      <div 
        className="absolute -top-3 -right-3 px-3 py-1 border-2 border-black dark:border-white text-black dark:text-white text-xs font-bold shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] z-20 pointer-events-none"
        style={{ backgroundColor: task.tagColor }}
      >
        {task.category}
      </div>

      <div className="flex justify-between items-start mb-2 mt-1 relative z-30">
        <h3 className="text-xl font-bold leading-tight flex-1 pr-4 break-words">{task.title}</h3>
        {/* Button Container */}
        <div className="flex gap-1 shrink-0 bg-white dark:bg-black border-2 border-black dark:border-white p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(task); }}
              className="p-1.5 hover:bg-black dark:hover:bg-white text-black dark:text-white dark:hover:text-black hover:text-white transition-colors flex items-center justify-center"
              title="Edit Task"
              type="button"
            >
              <Edit2 size={16} />
            </button>
            <div className="w-[1px] bg-black/10 dark:bg-white/20 mx-0.5"></div>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="p-1.5 hover:bg-red-600 text-red-600 hover:text-white transition-colors flex items-center justify-center"
              title="Delete Task"
              type="button"
            >
              <Trash2 size={16} />
            </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 break-words relative z-10">{task.description}</p>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-medium mb-4 relative z-10 text-gray-800 dark:text-gray-200">
        <div className="flex items-center gap-1.5" title="Deadline">
           <Calendar size={14} className="text-memphis-purple dark:text-purple-300" />
           {task.deadline ? (
             <span className={new Date(task.deadline) < new Date() ? 'text-red-600 dark:text-red-400 font-bold' : ''}>
               {format(new Date(task.deadline), 'MMM d, h:mm a')}
             </span>
           ) : <span className="text-gray-400 dark:text-gray-500">No Deadline</span>}
        </div>
        
        <div className="flex items-center gap-1.5" title="Difficulty Level">
           <Brain size={14} className="text-memphis-blue dark:text-blue-300" />
           Diff: {task.difficultyLevel}/10
        </div>

        <div className="flex items-center gap-1.5" title="Priority Level">
           <AlertCircle size={14} className={task.priority >= 7 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'} />
           Prio: {task.priority}/10
        </div>

        <div className="flex items-center gap-1.5" title="Bother Level">
           <Zap size={14} className="text-yellow-600 dark:text-yellow-400" />
           Bother: {task.botheredLevel}/10
        </div>
      </div>

      {/* Complete Action */}
      {isTopTask ? (
        <button 
          onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
          className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors border-2 border-transparent active:border-white dark:active:border-black relative z-20 cursor-pointer"
        >
          <Check size={20} />
          CROSS OUT
        </button>
      ) : (
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 italic border-t border-black/10 dark:border-white/10 pt-2 relative z-10">
          Waiting in backup...
        </div>
      )}
    </div>
  );
};
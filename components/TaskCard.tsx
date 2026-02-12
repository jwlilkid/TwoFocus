import React, { useState } from 'react';
import { Task } from '../types';
import { Check, Edit2, Zap, Brain, Calendar, AlertCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isTopTask?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit, onDelete, isTopTask }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Dynamic background based on priority (0-10)
  const getBgColor = () => {
    if (!isTopTask) return 'bg-white dark:bg-memphis-dark-surface'; // Backup tasks need dark bg in dark mode
    if (task.priority >= 8) return 'bg-red-100 dark:bg-red-900/40';
    if (task.priority >= 5) return 'bg-memphis-yellow dark:bg-yellow-600/80';
    return 'bg-memphis-mint dark:bg-cyan-900/60';
  };

  // Text color logic
  const getTextColor = () => {
      return 'text-black dark:text-white';
  };

  return (
    <div 
      className={`
        relative border-2 border-black dark:border-white transition-all duration-300 group
        ${isTopTask ? 'shadow-memphis hover:shadow-memphis-hover' : 'shadow-sm dark:shadow-none opacity-80 hover:opacity-100'}
        ${getBgColor()}
        ${getTextColor()}
        ${isExpanded ? 'p-5' : 'p-3'}
      `}
    >
      {/* Category Tag Badge */}
      <div 
        className={`absolute -top-3 -right-3 px-3 py-1 border-2 border-black dark:border-white text-black dark:text-white text-xs font-bold shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] z-20 pointer-events-none transition-transform origin-bottom-left ${isExpanded ? 'scale-100' : 'scale-90'}`}
        style={{ backgroundColor: task.tagColor }}
      >
        {task.category}
      </div>

      {/* Header Row: Always Visible */}
      <div className="flex justify-between items-center gap-2 relative z-30">
        
        {/* Title (Clickable to Toggle) */}
        <h3 
            className={`font-bold leading-tight flex-1 pr-2 break-words cursor-pointer select-none transition-all ${isExpanded ? 'text-xl' : 'text-lg line-clamp-1'}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title="Click to expand/collapse"
        >
            {task.title}
        </h3>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">
            {/* Tiny Icons Group */}
            <div className="flex gap-1 bg-white dark:bg-black border-2 border-black dark:border-white p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                  className="p-1 hover:bg-black dark:hover:bg-white text-black dark:text-white dark:hover:text-black hover:text-white transition-colors flex items-center justify-center"
                  title="Edit Task"
                  type="button"
                >
                  <Edit2 size={14} />
                </button>
                <div className="w-[1px] bg-black/10 dark:bg-white/20 mx-0.5"></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                  className="p-1 hover:bg-red-600 text-red-600 hover:text-white transition-colors flex items-center justify-center"
                  title="Delete Task"
                  type="button"
                >
                  <Trash2 size={14} />
                </button>
                
                {/* Cross Out Button - Only for Top Tasks */}
                {isTopTask && (
                    <>
                        <div className="w-[1px] bg-black/10 dark:bg-white/20 mx-0.5"></div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
                            className="p-1 hover:bg-memphis-mint text-green-600 hover:text-black transition-colors flex items-center justify-center"
                            title="Cross Out"
                            type="button"
                        >
                            <Check size={14} strokeWidth={3} />
                        </button>
                    </>
                )}
            </div>

            {/* Expand/Collapse Arrow Button */}
            <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border-2 border-transparent hover:scale-110 transition-transform rounded-full shadow-sm"
                title={isExpanded ? "Roll up" : "Expand"}
            >
                {isExpanded ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
            </button>
        </div>
      </div>
      
      {/* Expanded Content: Hidden by default */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-black/10 dark:border-white/10 animate-in fade-in slide-in-from-top-1 duration-200">
            {task.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 break-words relative z-10">{task.description}</p>
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

            {/* Complete Action (Expanded View) */}
            {isTopTask ? (
                <button 
                onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
                className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-bold py-3 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors border-2 border-transparent active:border-white dark:active:border-black relative z-20 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
                >
                <Check size={20} />
                CROSS OUT
                </button>
            ) : (
                <div className="text-center text-xs text-gray-500 dark:text-gray-500 italic pt-2 relative z-10">
                Waiting in backup...
                </div>
            )}
        </div>
      )}
    </div>
  );
};
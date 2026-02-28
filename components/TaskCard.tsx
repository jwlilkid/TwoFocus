import React, { useState, useRef } from 'react';
import { Task } from '../types';
import { Check, Edit2, Zap, Brain, Calendar, AlertCircle, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  
  // Swipe Logic State
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // Dynamic background based on priority (0-10)
  const getBgColor = () => {
    if (!isTopTask) return 'bg-white dark:bg-memphis-dark-surface'; 
    if (task.priority >= 8) return 'bg-memphis-pink dark:bg-memphis-pink';
    if (task.priority >= 5) return 'bg-memphis-yellow dark:bg-memphis-yellow';
    return 'bg-memphis-mint dark:bg-memphis-mint';
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX.current;

    // Limit swipe range (-120px to 120px)
    // Only allow swipe right (Complete) if it's a Top Task, or just allow it generally? 
    // Usually swipe-to-delete is always valid. Swipe-to-complete is valid for consistency.
    if (diff > 120) {
        setSwipeOffset(120);
    } else if (diff < -120) {
        setSwipeOffset(-120);
    } else {
        setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setIsSwiping(false);

    const snapThreshold = 60; // Distance required to snap open

    if (swipeOffset > snapThreshold) {
      // Snap to Open (Right / Complete)
      setSwipeOffset(100);
    } else if (swipeOffset < -snapThreshold) {
      // Snap to Open (Left / Delete)
      setSwipeOffset(-100);
    } else {
      // Snap Closed
      setSwipeOffset(0);
    }
  };

  const resetSwipe = () => {
      setSwipeOffset(0);
  };

  // Text color logic
  const getTextColor = () => {
      if (!isTopTask) return 'text-black dark:text-white';
      return 'text-black dark:text-black';
  };

  return (
    <div className="relative mb-0 overflow-hidden select-none">
      
      {/* Background Action Layer (Revealed on Swipe) */}
      <div className="absolute inset-0 flex justify-between items-center rounded-sm">
        {/* Left Side: Complete (Green) */}
        <div 
            className="flex items-center justify-start pl-6 h-full w-1/2 bg-memphis-mint dark:bg-green-900 cursor-pointer"
            onClick={() => { onComplete(task.id); resetSwipe(); }}
        >
            <Check size={24} className="text-black dark:text-white" strokeWidth={3} />
        </div>
        
        {/* Right Side: Delete (Red) */}
        <div 
            className="flex items-center justify-end pr-6 h-full w-1/2 bg-red-500 cursor-pointer"
            onClick={() => { onDelete(task.id); resetSwipe(); }}
        >
            <Trash2 size={24} className="text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Foreground Card */}
      <div 
        className={`
          relative border-2 transition-transform group
          ${isTopTask ? 'border-black dark:border-black shadow-memphis' : 'border-black dark:border-white shadow-sm dark:shadow-none opacity-80'}
          ${getBgColor()}
          ${getTextColor()}
          ${isExpanded ? (isTopTask ? 'p-6 md:p-8' : 'p-5') : (isTopTask ? 'p-5 md:p-6' : 'p-3')}
        `}
        style={{ 
            transform: `translateX(${swipeOffset}px)`,
            transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            touchAction: 'pan-y' // Allows vertical scroll, captures horizontal gestures manually
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Category Tag Badge */}
        <div 
          className={`absolute -top-3 -right-3 px-3 py-1 border-2 text-xs font-bold shadow-[2px_2px_0px_0px_#000] z-20 pointer-events-none transition-transform origin-bottom-left ${isExpanded ? 'scale-100' : 'scale-90'} ${isTopTask ? 'border-black dark:border-black text-black dark:text-black dark:shadow-[2px_2px_0px_0px_#000]' : 'border-black dark:border-white text-black dark:text-white dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)]'}`}
          style={{ backgroundColor: task.tagColor }}
        >
          {task.category}
        </div>

        {/* Header Row: Always Visible */}
        <div className="flex justify-between items-center gap-2 relative z-30">
          
          {/* Title (Clickable to Toggle) */}
          <h3 
              className={`font-bold leading-tight flex-1 pr-2 break-words cursor-pointer transition-all ${isExpanded ? (isTopTask ? 'text-2xl md:text-3xl' : 'text-xl') : (isTopTask ? 'text-xl md:text-2xl line-clamp-2' : 'text-lg line-clamp-1')}`}
              onClick={() => { 
                  if (swipeOffset === 0) setIsExpanded(!isExpanded); 
                  else resetSwipe(); // If expanded swipe, close swipe first
              }}
              title="Click to expand/collapse"
          >
              {task.title}
          </h3>

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0">
              {/* Tiny Icons Group */}
              <div className={`flex gap-1 border-2 p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] ${isTopTask ? 'bg-white dark:bg-white border-black dark:border-black' : 'bg-white dark:bg-black border-black dark:border-white'}`}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                    className={`p-1 transition-colors flex items-center justify-center ${isTopTask ? 'hover:bg-black text-black hover:text-white dark:hover:bg-black dark:text-black dark:hover:text-white' : 'hover:bg-black dark:hover:bg-white text-black dark:text-white dark:hover:text-black hover:text-white'}`}
                    title="Edit Task"
                    type="button"
                  >
                    <Edit2 size={14} />
                  </button>
                  <div className={`w-[1px] mx-0.5 ${isTopTask ? 'bg-black/20 dark:bg-black/20' : 'bg-black/10 dark:bg-white/20'}`}></div>
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
                          <div className="w-[1px] bg-black/20 dark:bg-black/20 mx-0.5"></div>
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
                  onClick={(e) => { 
                      e.stopPropagation(); 
                      if (swipeOffset === 0) setIsExpanded(!isExpanded);
                      else resetSwipe();
                  }}
                  className={`w-8 h-8 flex items-center justify-center border-2 border-transparent hover:scale-110 transition-transform rounded-full shadow-sm ${isTopTask ? 'bg-black dark:bg-black text-white dark:text-white' : 'bg-black dark:bg-white text-white dark:text-black'}`}
                  title={isExpanded ? "Roll up" : "Expand"}
              >
                  {isExpanded ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
              </button>
          </div>
        </div>
        
        {/* Expanded Content: Hidden by default */}
        {isExpanded && (
          <div className={`mt-4 pt-4 border-t-2 animate-in fade-in slide-in-from-top-1 duration-200 ${isTopTask ? 'border-black/20 dark:border-black/20' : 'border-black/10 dark:border-white/10'}`}>
              {task.description && (
                  <p className={`text-sm mb-4 break-words relative z-10 ${isTopTask ? 'text-gray-800 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}>{task.description}</p>
              )}

              {/* Metadata Grid */}
              <div className={`grid grid-cols-2 gap-2 text-xs font-medium mb-4 relative z-10 ${isTopTask ? 'text-gray-900 dark:text-gray-900' : 'text-gray-800 dark:text-gray-200'}`}>
                  <div className="flex items-center gap-1.5" title="Deadline">
                  <Calendar size={14} className={isTopTask ? 'text-memphis-purple dark:text-memphis-purple' : 'text-memphis-purple dark:text-purple-300'} />
                  {task.deadline ? (
                      <span className={new Date(task.deadline) < new Date() ? 'text-red-600 dark:text-red-600 font-bold' : ''}>
                      {format(new Date(task.deadline), 'MMM d, h:mm a')}
                      </span>
                  ) : <span className={isTopTask ? 'text-gray-600 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'}>No Deadline</span>}
                  </div>
                  
                  <div className="flex items-center gap-1.5" title="Difficulty Level">
                  <Brain size={14} className={isTopTask ? 'text-memphis-blue dark:text-memphis-blue' : 'text-memphis-blue dark:text-blue-300'} />
                  Diff: {task.difficultyLevel}/10
                  </div>

                  <div className="flex items-center gap-1.5" title="Priority Level">
                  <AlertCircle size={14} className={task.priority >= 7 ? 'text-red-600 dark:text-red-600' : (isTopTask ? 'text-gray-700 dark:text-gray-700' : 'text-gray-600 dark:text-gray-400')} />
                  Prio: {task.priority}/10
                  </div>

                  <div className="flex items-center gap-1.5" title="Bother Level">
                  <Zap size={14} className={isTopTask ? 'text-yellow-700 dark:text-yellow-700' : 'text-yellow-600 dark:text-yellow-400'} />
                  Bother: {task.botheredLevel}/10
                  </div>
              </div>

              {/* Complete Action (Expanded View) */}
              {isTopTask ? (
                  <button 
                  onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
                  className="w-full flex items-center justify-center gap-2 bg-black dark:bg-black text-white dark:text-white font-bold py-3 hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors border-2 border-transparent active:border-white dark:active:border-white relative z-20 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]"
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

      {/* Swipe Overlay Hint (Optional: Shows visually when snapping happens) */}
      {swipeOffset !== 0 && (
          <div 
            className="absolute top-0 bottom-0 z-40 flex items-center justify-center pointer-events-none transition-opacity duration-300"
            style={{ 
                left: swipeOffset > 0 ? '10px' : 'auto', 
                right: swipeOffset < 0 ? '10px' : 'auto',
                opacity: Math.abs(swipeOffset) > 60 ? 1 : 0 
            }}
          >
              {/* This is just a visual helper if needed, but the background layer handles the icon nicely */}
          </div>
      )}
    </div>
  );
};
import React from 'react';
import { Task } from '../../types';
import { X, CalendarCheck, Undo2 } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: Task[];
  onClearHistory: () => void;
  onRestore: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, completedTasks, onClearHistory, onRestore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-memphis-dark-surface border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_#23a6d5] dark:shadow-[8px_8px_0px_0px_var(--memphis-shadow)] w-full max-w-lg max-h-[80vh] flex flex-col transition-colors">
        <div className="p-4 border-b-2 border-black dark:border-white flex justify-between items-center bg-memphis-mint dark:bg-cyan-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
            <CalendarCheck /> Task History
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded dark:text-white dark:hover:bg-white/20"><X size={24} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">No completed tasks yet. Get to work!</div>
          ) : (
            <div className="space-y-3">
              {[...completedTasks].sort((a,b) => (b.completedAt || 0) - (a.completedAt || 0)).map(task => (
                <div key={task.id} className="border-b-2 border-gray-100 dark:border-gray-800 pb-3 last:border-0 flex justify-between items-center group">
                  <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold line-through text-gray-500 dark:text-gray-400 decoration-2">{task.title}</h4>
                            <span 
                                className="text-[10px] px-2 py-0.5 border border-black dark:border-white font-bold text-black"
                                style={{ backgroundColor: task.tagColor }}
                            >
                                {task.category}
                            </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Completed: {task.completedAt ? format(task.completedAt, 'PPp') : 'Unknown'}
                      </p>
                  </div>
                  
                  {/* Withdraw/Restore Button */}
                  <button 
                    onClick={() => onRestore(task.id)}
                    className="ml-3 p-2 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all text-black dark:text-white group-hover:bg-memphis-yellow dark:group-hover:bg-yellow-700"
                    title="Withdraw / Restore Task"
                  >
                    <Undo2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {completedTasks.length > 0 && (
            <div className="p-4 border-t-2 border-black dark:border-white bg-gray-50 dark:bg-white/5">
                <button 
                    onClick={onClearHistory}
                    className="w-full py-2 text-sm text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 transition-colors"
                >
                    Clear History
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
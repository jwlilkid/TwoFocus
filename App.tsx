import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, RankingCriteria } from './types';
import { Button } from './components/ui/Button';
import { CategoryFilter } from './components/CategoryFilter';
import { RankingSelector } from './components/RankingSelector';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/modals/TaskModal';
import { HistoryModal } from './components/modals/HistoryModal';
import { Plus, History, Sun, Moon } from 'lucide-react';

// Migration helper
const migrateTask = (t: any): Task => {
  let priority = typeof t.priority === 'number' ? t.priority : 5;
  if (typeof t.priority === 'string') {
     if (t.priority === 'High') priority = 9;
     else if (t.priority === 'Medium') priority = 5;
     else priority = 2;
  }
  
  let difficultyLevel = typeof t.difficultyLevel === 'number' ? t.difficultyLevel : 5;
  if (t.difficultyMinutes !== undefined) {
     difficultyLevel = Math.min(10, Math.ceil((t.difficultyMinutes / 60) * 5));
  }

  return {
    ...t,
    priority,
    difficultyLevel,
    botheredLevel: t.botheredLevel ?? 5,
  };
};

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('memphis-theme');
        if (stored === 'dark' || stored === 'light') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
    } catch (e) {}
    return 'light';
  });

  // Data States
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem('memphis-tasks');
      if (stored) return JSON.parse(stored).map(migrateTask);
    } catch (e) {}
    return [];
  });

  const [completedTasks, setCompletedTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem('memphis-completed');
      if (stored) return JSON.parse(stored).map(migrateTask);
    } catch (e) {}
    return [];
  });

  const [rankingMethod, setRankingMethod] = useState<RankingCriteria>(() => {
    try {
      const stored = localStorage.getItem('memphis-ranking');
      if (stored) return stored as RankingCriteria;
    } catch (e) {}
    return RankingCriteria.PRIORITY;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Last Used Category State for UX convenience
  const [lastUsedCategory, setLastUsedCategory] = useState<string>(() => {
    try {
      return localStorage.getItem('memphis-last-category') || '';
    } catch { return ''; }
  });

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('memphis-theme', theme);
  }, [theme]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('memphis-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('memphis-completed', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('memphis-ranking', rankingMethod);
  }, [rankingMethod]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Derived Data
  const categories = useMemo(() => {
    const uniqueCats = new Set(tasks.map(t => t.category).filter(Boolean));
    return Array.from(uniqueCats).sort();
  }, [tasks]);

  // Map categories to their last used colors for smart suggestion
  const categoryColors = useMemo(() => {
    const map: Record<string, string> = {};
    // Iterate through all tasks to build the map
    tasks.forEach(t => {
      if (t.category) map[t.category] = t.tagColor || '#ff90e8';
    });
    return map;
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    let filtered = activeCategory === 'All' 
      ? tasks 
      : tasks.filter(t => t.category === activeCategory);

    return [...filtered].sort((a, b) => {
      switch (rankingMethod) {
        case RankingCriteria.PRIORITY:
          if (b.priority !== a.priority) return b.priority - a.priority;
          return b.createdAt - a.createdAt; 
        case RankingCriteria.BOTHERED:
          if (b.botheredLevel !== a.botheredLevel) return b.botheredLevel - a.botheredLevel;
          return b.priority - a.priority;
        case RankingCriteria.DIFFICULTY:
          if (b.difficultyLevel !== a.difficultyLevel) return b.difficultyLevel - a.difficultyLevel;
          return b.priority - a.priority;
        case RankingCriteria.CATEGORY:
            const catCompare = a.category.localeCompare(b.category);
            if (catCompare !== 0) return catCompare;
            return b.priority - a.priority;
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [tasks, activeCategory, rankingMethod]);

  const topTasks = sortedTasks.slice(0, 2);
  const backupTasks = sortedTasks.slice(2);

  // Handlers
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    const newTask: Task = { ...taskData, id: uuidv4(), createdAt: Date.now() };
    setTasks(prev => [...prev, newTask]);
    
    // Update last used category persistence
    setLastUsedCategory(taskData.category);
    localStorage.setItem('memphis-last-category', taskData.category);
    
    if (activeCategory !== 'All' && taskData.category !== activeCategory) setActiveCategory('All');
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    if (!editingTask) return;
    setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    
    // Also update preference on edit
    setLastUsedCategory(taskData.category);
    localStorage.setItem('memphis-last-category', taskData.category);
    
    setEditingTask(null);
  };

  const handleCompleteTask = (id: string) => {
    const taskToComplete = tasks.find(t => t.id === id);
    if (taskToComplete) {
      const completed: Task = { ...taskToComplete, completedAt: Date.now() };
      setCompletedTasks(prev => [...prev, completed]);
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleRestoreTask = (id: string) => {
    const taskToRestore = completedTasks.find(t => t.id === id);
    if (taskToRestore) {
        setCompletedTasks(prev => prev.filter(t => t.id !== id));
        const restoredTask = { ...taskToRestore };
        delete restoredTask.completedAt;
        setTasks(prev => [...prev, restoredTask]);
    }
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (editingTask && editingTask.id === id) {
            setIsTaskModalOpen(false);
            setEditingTask(null);
        }
    }
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleClearHistory = () => {
      setCompletedTasks([]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-memphis-dark' : 'bg-memphis-light'}`}>
      <div className="pb-20 px-4 md:px-8 max-w-5xl mx-auto pt-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight mb-2 relative inline-block transition-colors">
              FocusTwo
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-memphis-yellow -z-10 opacity-70 transform -rotate-1"></div>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors">Get it done. Two at a time.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
              <Button 
                onClick={toggleTheme} 
                variant="secondary" 
                className="flex items-center gap-2"
                title={theme === 'light' ? 'Switch to Night Mode' : 'Switch to Day Mode'}
              >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </Button>
              <Button onClick={() => setIsHistoryModalOpen(true)} variant="secondary" className="flex items-center gap-2">
                  <History size={18} /> History ({completedTasks.length})
              </Button>
              <Button onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }} className="flex items-center gap-2">
                  <Plus size={20} strokeWidth={3} /> Add Task
              </Button>
          </div>
        </header>

        {/* Controls */}
        {categories.length > 0 && (
            <CategoryFilter 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
        )}
        
        <RankingSelector 
          currentRanking={rankingMethod} 
          onRankingChange={setRankingMethod} 
        />

        {/* Main Focus Area */}
        {sortedTasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-memphis-dark-surface border-2 border-black dark:border-white border-dashed rounded-lg transition-colors">
            <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-2">No tasks found!</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You're either extremely productive or procrastinating.</p>
            <Button onClick={() => setIsTaskModalOpen(true)}>Create First Task</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Top Task 1 */}
              {topTasks[0] && (
                  <div className="relative">
                      <div className="absolute -top-4 -left-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 font-bold text-sm transform -rotate-3 z-10 shadow-[4px_4px_0px_0px_var(--memphis-shadow)] transition-colors">
                          FOCUS #1
                      </div>
                      <TaskCard 
                          task={topTasks[0]} 
                          onComplete={handleCompleteTask} 
                          onEdit={handleOpenEdit} 
                          onDelete={handleDeleteTask}
                          isTopTask={true} 
                      />
                  </div>
              )}
              
              {/* Top Task 2 */}
              {topTasks[1] && (
                  <div className="relative">
                      <div className="absolute -top-4 -left-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 font-bold text-sm transform rotate-2 z-10 shadow-[4px_4px_0px_0px_var(--memphis-shadow)] transition-colors">
                          FOCUS #2
                      </div>
                      <TaskCard 
                          task={topTasks[1]} 
                          onComplete={handleCompleteTask} 
                          onEdit={handleOpenEdit} 
                          onDelete={handleDeleteTask}
                          isTopTask={true} 
                      />
                  </div>
              )}
          </div>
        )}

        {/* Backup List */}
        {backupTasks.length > 0 && (
          <div className="mt-12">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-black dark:text-white transition-colors">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  Up Next ({backupTasks.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                  {backupTasks.map(task => (
                      <TaskCard 
                          key={task.id} 
                          task={task} 
                          onComplete={handleCompleteTask} 
                          onEdit={handleOpenEdit} 
                          onDelete={handleDeleteTask}
                          isTopTask={false} 
                      />
                  ))}
              </div>
          </div>
        )}

        {/* Modals */}
        <TaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
          onSave={editingTask ? handleEditTask : handleAddTask}
          onDelete={handleDeleteTask}
          initialTask={editingTask}
          existingCategories={categories}
          categoryColors={categoryColors}
          defaultCategory={lastUsedCategory}
        />

        <HistoryModal 
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          completedTasks={completedTasks}
          onClearHistory={handleClearHistory}
          onRestore={handleRestoreTask}
        />
      </div>
    </div>
  );
}
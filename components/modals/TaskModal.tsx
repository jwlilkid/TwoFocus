import React, { useState, useEffect } from 'react';
import { Task, DEFAULT_COLORS } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, AlertCircle, Brain, Zap, Trash2, Tag } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => void;
  onDelete?: (id: string) => void;
  initialTask?: Task | null;
  existingCategories?: string[];
  categoryColors?: Record<string, string>;
  defaultCategory?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initialTask,
  existingCategories = [],
  categoryColors = {},
  defaultCategory = ''
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Continuous sliders 0-10
  const [priority, setPriority] = useState(5);
  const [botheredLevel, setBotheredLevel] = useState(5);
  const [difficultyLevel, setDifficultyLevel] = useState(5);
  
  const [category, setCategory] = useState('');
  const [tagColor, setTagColor] = useState(DEFAULT_COLORS[0]);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');

  // Reset or Load initial data
  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description || '');
        setPriority(initialTask.priority);
        setBotheredLevel(initialTask.botheredLevel);
        setDifficultyLevel(initialTask.difficultyLevel);
        setCategory(initialTask.category);
        setTagColor(initialTask.tagColor);
        
        if (initialTask.deadline) {
          const d = new Date(initialTask.deadline);
          // Format for input type="date" and "time"
          setDeadlineDate(d.toISOString().split('T')[0]);
          setDeadlineTime(d.toTimeString().slice(0, 5));
        } else {
            setDeadlineDate('');
            setDeadlineTime('');
        }
      } else {
        // Defaults for new task
        setTitle('');
        setDescription('');
        setPriority(5);
        setBotheredLevel(5);
        setDifficultyLevel(5);
        
        // Auto-fill category from memory
        const startCategory = defaultCategory;
        setCategory(startCategory);
        
        // Auto-fill color if category exists
        if (startCategory && categoryColors[startCategory]) {
            setTagColor(categoryColors[startCategory]);
        } else {
            setTagColor(DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)]);
        }

        setDeadlineDate('');
        setDeadlineTime('');
      }
    }
  }, [isOpen, initialTask, defaultCategory, categoryColors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category.trim()) return;

    let deadlineIso: string | undefined = undefined;
    if (deadlineDate) {
        const time = deadlineTime || '23:59';
        deadlineIso = new Date(`${deadlineDate}T${time}`).toISOString();
    }

    onSave({
      title,
      description,
      priority,
      botheredLevel,
      difficultyLevel,
      category,
      tagColor,
      deadline: deadlineIso,
    });
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (initialTask && onDelete) {
        onDelete(initialTask.id);
    }
  };

  const handleCategorySelect = (cat: string) => {
      setCategory(cat);
      if (categoryColors[cat]) {
          setTagColor(categoryColors[cat]);
      }
  };

  if (!isOpen) return null;

  const renderSlider = (
    label: string, 
    value: number, 
    setValue: (val: number) => void, 
    icon: React.ReactNode,
    lowLabel: string,
    highLabel: string,
    colorClass: string
  ) => (
    <div className="bg-gray-50 dark:bg-white/5 p-3 border-2 border-black/10 dark:border-white/20 rounded-sm">
      <div className="flex justify-between items-center mb-2">
         <label className="font-bold text-sm flex items-center gap-2 dark:text-white">
            {icon} {label}
         </label>
         <span className={`font-black text-lg ${colorClass} bg-white dark:bg-black border-2 border-black dark:border-white px-2 py-0.5 min-w-[3rem] text-center`}>
            {value}
         </span>
      </div>
      <div className="flex items-center gap-3">
         <span className="text-xs font-bold text-gray-400 uppercase">{lowLabel}</span>
         <input 
            type="range" 
            min="0" 
            max="10" 
            value={value} 
            onChange={e => setValue(Number(e.target.value))} 
            className="w-full h-3 bg-white rounded-lg appearance-none cursor-pointer border-2 border-black accent-black dark:accent-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
         />
         <span className="text-xs font-bold text-gray-400 uppercase">{highLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-memphis-dark-surface border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(255,144,232,1)] dark:shadow-[8px_8px_0px_0px_var(--memphis-shadow)] w-full max-w-lg max-h-[90vh] overflow-y-auto transition-colors">
        <div className="p-4 border-b-2 border-black dark:border-white flex justify-between items-center bg-memphis-yellow dark:bg-yellow-600">
          <h2 className="text-xl font-bold text-black dark:text-white">{initialTask ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded dark:text-white dark:hover:bg-white/20"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <Input 
            label="What needs to be done?" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Finish the report"
            required
            autoFocus
          />

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm dark:text-white">Description</label>
            <textarea 
              className="border-2 border-black dark:border-white p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_var(--memphis-shadow)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_var(--memphis-shadow)] w-full resize-none h-20 bg-white dark:bg-memphis-dark-surface dark:text-white"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details..."
            />
          </div>

          <div className="space-y-4">
             {renderSlider('Priority', priority, setPriority, <AlertCircle size={16}/>, 'Low', 'Urgent', 'text-red-500')}
             {renderSlider('Difficulty', difficultyLevel, setDifficultyLevel, <Brain size={16}/>, 'Easy', 'Hard', 'text-memphis-blue')}
             {renderSlider('Bothered Level', botheredLevel, setBotheredLevel, <Zap size={16}/>, 'Chill', 'Annoying', 'text-yellow-600')}
          </div>

          {/* Tag & Color System */}
          <div className="border-2 border-black dark:border-white p-4 bg-gray-50 dark:bg-white/5 relative mt-6">
             <label className="absolute -top-3 left-3 bg-gray-50 dark:bg-memphis-dark-surface dark:text-white border dark:border-white px-2 font-bold text-sm">Category & Tag</label>
             <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <Input 
                        label="Category Name" 
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        placeholder="e.g. Work, Health"
                        list="existing-categories"
                        required
                    />
                    <datalist id="existing-categories">
                        {existingCategories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>

                    {/* Quick Select Chips */}
                    {existingCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {existingCategories.slice(0, 6).map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => handleCategorySelect(cat)}
                                    className="text-xs font-bold px-2 py-1 rounded-sm border border-black dark:border-white hover:opacity-80 transition-transform active:scale-95 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)]"
                                    style={{ backgroundColor: categoryColors[cat] || '#fff' }}
                                    title="Quick select category"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold dark:text-white">Color</label>
                    <input 
                        type="color" 
                        value={tagColor} 
                        onChange={e => setTagColor(e.target.value)}
                        className="h-[42px] w-[50px] border-2 border-black dark:border-white p-0 cursor-pointer"
                    />
                </div>
             </div>
             
             {/* Preset Colors */}
             <div className="flex flex-wrap gap-2 mt-3">
                {DEFAULT_COLORS.map(c => (
                    <button
                        key={c}
                        type="button"
                        onClick={() => setTagColor(c)}
                        className={`w-6 h-6 rounded-full border border-black dark:border-white ${tagColor === c ? 'ring-2 ring-offset-1 ring-black dark:ring-white scale-110' : ''}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
             </div>
          </div>

          {/* Deadline System */}
          <div className="grid grid-cols-2 gap-4">
             <Input 
                type="date" 
                label="Deadline Date" 
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
             />
             <Input 
                type="time" 
                label="Time" 
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                disabled={!deadlineDate}
             />
          </div>

          <div className="pt-4 flex justify-between gap-3 items-center">
             {initialTask ? (
                 <Button type="button" variant="danger" onClick={handleDelete} className="flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                 </Button>
             ) : (
                 <div></div> 
             )}
             
             <div className="flex gap-3">
                 <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                 <Button type="submit" variant="primary">
                     {initialTask ? 'Update Task' : 'Add Task'}
                 </Button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
};
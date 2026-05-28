/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TodoItem, HabitItem, Language } from '../types';
import { translate } from '../i18n';
import { Plus, Trash2, CheckCircle2, Award, Sparkles, Filter, CheckSquare, CalendarDays } from 'lucide-react';
import { playClickSfx, playToggleSfx, playChecklistSfx } from '../utils/sfx';

interface TodoHabitModuleProps {
  language: Language;
}

export default function TodoHabitModule({ language }: TodoHabitModuleProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [habits, setHabits] = useState<HabitItem[]>([]);

  // Form states
  const [todoInput, setTodoInput] = useState('');
  const [todoCat, setTodoCat] = useState<'work' | 'creative' | 'study' | 'personal'>('work');
  const [todoPriority, setTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [habitInput, setHabitInput] = useState('');

  // Filter state
  const [todoFilter, setTodoFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Load from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('kopispace_todos');
    const savedHabits = localStorage.getItem('kopispace_habits');
    
    if (savedTodos) {
      try { setTodos(JSON.parse(savedTodos)); } catch (e) {}
    } else {
      setTodos([
        { id: 't1', text: 'Selesaikan laporan sprint (IT)', completed: false, date: new Date().toISOString(), category: 'work', priority: 'high' },
        { id: 't2', text: 'Desain layout cangkir kopi (Kreatif)', completed: true, date: new Date().toISOString(), category: 'creative', priority: 'medium' },
        { id: 't3', text: 'Baca modul Algoritma Bab 2 (Belajar)', completed: false, date: new Date().toISOString(), category: 'study', priority: 'low' }
      ]);
    }

    if (savedHabits) {
      try { setHabits(JSON.parse(savedHabits)); } catch (e) {}
    } else {
      setHabits([
        { id: 'hb1', name: '💻 Menulis kode 1 jam', streak: 5, lastCompletedDate: null, history: [] },
        { id: 'hb2', name: '🎨 Latihan sketsa desain', streak: 2, lastCompletedDate: null, history: [] },
        { id: 'hb3', name: '☕ Minum air putih 8 gelas', streak: 12, lastCompletedDate: null, history: [] }
      ]);
    }
  }, []);

  const saveTodos = (updated: TodoItem[]) => {
    setTodos(updated);
    localStorage.setItem('kopispace_todos', JSON.stringify(updated));
  };

  const saveHabits = (updated: HabitItem[]) => {
    setHabits(updated);
    localStorage.setItem('kopispace_habits', JSON.stringify(updated));
  };

  // Add Todo Action
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;
    playClickSfx();
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: todoInput,
      completed: false,
      date: new Date().toISOString(),
      category: todoCat,
      priority: todoPriority,
    };
    const updated = [newTodo, ...todos];
    saveTodos(updated);
    setTodoInput('');
  };

  // Toggle Todo completed status (plays satisfying major chord SFX when checked true!)
  const handleToggleTodo = (id: string) => {
    const original = todos.find(t => t.id === id);
    const becameCompleted = original ? !original.completed : false;
    
    if (becameCompleted) {
      playChecklistSfx();
    } else {
      playClickSfx();
    }

    const updated = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    saveTodos(updated);
  };

  // Delete Todo Action
  const handleDeleteTodo = (id: string) => {
    playToggleSfx();
    const updated = todos.filter(t => t.id !== id);
    saveTodos(updated);
  };

  // Add Habit Action
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitInput.trim()) return;
    playClickSfx();
    const newHabit: HabitItem = {
      id: Date.now().toString(),
      name: habitInput,
      streak: 0,
      lastCompletedDate: null,
      history: [],
    };
    const updated = [...habits, newHabit];
    saveHabits(updated);
    setHabitInput('');
  };

  // Habit tracker streak completion trigger
  const handleToggleHabit = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    playChecklistSfx();
    const completedToday = habit.lastCompletedDate === todayStr;

    const updated = habits.map(h => {
      if (h.id === id) {
        // Uncheck if completed today, otherwise complete and add to streak calendar
        if (completedToday) {
          const filteredHistory = h.history.filter(date => date !== todayStr);
          return {
            ...h,
            streak: Math.max(0, h.streak - 1),
            lastCompletedDate: filteredHistory.length > 0 ? filteredHistory[filteredHistory.length - 1] : null,
            history: filteredHistory
          };
        } else {
          return {
            ...h,
            streak: h.streak + 1,
            lastCompletedDate: todayStr,
            history: [...h.history, todayStr]
          };
        }
      }
      return h;
    });
    saveHabits(updated);
  };

  // Delete Habit Action
  const handleDeleteHabit = (id: string) => {
    playToggleSfx();
    const updated = habits.filter(h => h.id !== id);
    saveHabits(updated);
  };

  // Progress calculations
  const totalTasksToday = todos.length;
  const completedTasksToday = todos.filter(t => t.completed).length;
  const progressPercent = totalTasksToday > 0 ? Math.round((completedTasksToday / totalTasksToday) * 100) : 0;

  // Filtered Todos
  const filteredTodos = todos.filter(t => {
    if (todoFilter === 'pending') return !t.completed;
    if (todoFilter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* LEFT SECTION - TODO LIST (8 COLS) */}
      <div className="lg:col-span-7 flex flex-col bg-[#fdfdfc] dark:bg-[#120d0a] border-4 border-[#3a281d] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(59,130,246,1)] relative">
        
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <CheckSquare className="text-[#3b82f6] w-6 h-6" />
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">
              {translate('todoTitle', language)}
            </h2>
          </div>

          {/* Quick Select Filter */}
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-[#1a1410] p-1 border-2 border-zinc-300 dark:border-zinc-800 rounded-xl">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  playClickSfx();
                  setTodoFilter(f as any);
                }}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-lg transition-all duration-200 ${
                  todoFilter === f
                    ? 'bg-[#3b82f6] text-white border border-white'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="mb-6 p-4 bg-amber-50 dark:bg-[#1c1410] border-2 border-[#eaccb2] dark:border-[#3a281d] rounded-2xl">
          <div className="flex justify-between items-center mb-1.5 font-mono text-[11px]">
            <span className="text-zinc-500 flex items-center gap-1 uppercase">
              <Sparkles size={12} className="text-amber-500 animate-spin" /> {translate('completionRate', language)}
            </span>
            <span className="font-extrabold text-[#3b82f6] text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700">
            <div
              className="bg-[#3b82f6] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task input form */}
        <form onSubmit={handleAddTodo} className="mb-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder={translate('addTodo', language)}
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs font-mono rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1e1510] text-zinc-900 dark:text-[#f3e3d3] focus:outline-none focus:border-[#3b82f6]"
            />
            
            <button
              type="submit"
              id="todo-add-task-btn"
              className="px-5 py-2.5 bg-[#3b82f6] border-2 border-white text-white font-extrabold text-xs uppercase -skew-x-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-103 active:scale-95 transition-all duration-150"
            >
              🚀 ADD
            </button>
          </div>

          {/* Settings Tag selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* Category tag select */}
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase text-zinc-400 mb-1">Tag</span>
              <select
                value={todoCat}
                onChange={(e) => setTodoCat(e.target.value as any)}
                className="p-1 px-2 text-[11px] font-mono rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 focus:outline-none focus:border-blue-500"
              >
                <option value="work">💼 Work</option>
                <option value="creative">🎨 Creative</option>
                <option value="study">🎓 Study</option>
                <option value="personal">🏡 Personal</option>
              </select>
            </div>

            {/* Priority level select */}
            <div className="flex flex-col">
              <span className="text-[9px] font-mono uppercase text-zinc-400 mb-1">Priority</span>
              <select
                value={todoPriority}
                onChange={(e) => setTodoPriority(e.target.value as any)}
                className="p-1 px-2 text-[11px] font-mono rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-750 focus:outline-none"
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

          </div>
        </form>

        {/* Items Listing */}
        <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] md:max-h-[380px] pr-1">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-10 font-mono text-zinc-400 text-xs">
              ☕ {translate('todoEmpty', language)}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => handleToggleTodo(todo.id)}
                className={`group flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  todo.completed
                    ? 'bg-zinc-50 dark:bg-[#14100c] border-zinc-100 dark:border-[#211a14] opacity-65'
                    : 'bg-white dark:bg-[#19130f] border-[#ebdcd0] dark:border-[#3a281d] hover:border-[#3b82f6]'
                }`}
              >
                <div className="flex items-center gap-3 truncate flex-1">
                  {/* Styled Checkbox */}
                  <div
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'border-zinc-400 bg-transparent'
                    }`}
                  >
                    {todo.completed && <CheckCircle2 size={13} className="stroke-[3px]" />}
                  </div>

                  <div className="truncate flex-1">
                    <span
                      className={`text-xs font-mono truncate block ${
                        todo.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'
                      }`}
                    >
                      {todo.text}
                    </span>
                    
                    {/* Badge details */}
                    <div className="flex gap-2.5 mt-1 font-sans text-[8px] uppercase tracking-wider">
                      <span className="text-amber-600 font-bold dark:text-amber-400">
                        #{todo.category}
                      </span>
                      <span
                        className={`font-mono font-extrabold ${
                          todo.priority === 'high'
                            ? 'text-rose-500'
                            : todo.priority === 'medium'
                            ? 'text-yellow-500'
                            : 'text-green-500'
                        }`}
                      >
                        {todo.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTodo(todo.id);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT SECTION - HABITS TRACKER (5 COLS) */}
      <div className="lg:col-span-5 bg-[#faf6f0] dark:bg-[#1d1611] border-4 border-[#3a281d] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(59,130,246,1)] flex flex-col relative overflow-hidden">
        
        {/* Decorative Persona visual corner */}
        <div className="absolute -top-1 right-0 w-16 h-16 bg-[#3b82f6] -skew-y-12 rotate-12 opacity-15" />

        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5">
          <Award className="text-amber-500 w-6 h-6" />
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">
            {translate('habitTitle', language)}
          </h2>
        </div>

        {/* Habits Add Input */}
        <form onSubmit={handleAddHabit} className="mb-5 flex gap-2">
          <input
            type="text"
            placeholder={translate('addHabit', language)}
            value={habitInput}
            onChange={(e) => setHabitInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs font-mono rounded-xl border border-[#d3beab] dark:border-zinc-800 bg-white dark:bg-[#130f0c] text-zinc-900 dark:text-orange-100 focus:outline-none focus:border-[#3b82f6]"
          />
          <button
            type="submit"
            id="habit-add-btn"
            className="p-2.5 bg-[#ff9f1c] text-white border-2 border-white font-extrabold text-xs -skew-x-6 hover:scale-103 active:scale-95 transition-all duration-150"
          >
            🔥 ADD
          </button>
        </form>

        {/* Habit list items */}
        <div className="space-y-3.5 overflow-y-auto max-h-[360px] pr-1 flex-1">
          {habits.length === 0 ? (
            <div className="text-center py-10 font-mono text-zinc-400 text-xs">
              🍃 {translate('habitEmpty', language)}
            </div>
          ) : (
            habits.map((habit) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const completedToday = habit.lastCompletedDate === todayStr;

              return (
                <div
                  key={habit.id}
                  className="p-3 border-2 border-[#eaccb2] dark:border-[#3a281d] bg-white dark:bg-[#14100c] rounded-2xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="truncate flex-1">
                    <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100 block truncate">
                      {habit.name}
                    </span>
                    
                    {/* Streak badge */}
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-mono font-extrabold bg-[#ffe8cc] dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-lg border border-orange-300">
                      ⚡ Streak: {habit.streak} {language === 'id' ? 'hari' : language === 'jp' ? '日' : 'days'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark done button */}
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`p-1.5 px-3 rounded-lg border-2 text-[10px] font-mono font-extrabold flex items-center gap-1 transition-all duration-200 ${
                        completedToday
                          ? 'bg-green-500 border-green-600 text-white shadow-sm'
                          : 'bg-[#3b82f6] border-white text-white hover:bg-blue-600'
                      }`}
                    >
                      <CheckCircle2 size={11} className={completedToday ? 'rotate-12' : ''} />
                      {completedToday ? translate('habitDone', language) : 'DONE'}
                    </button>

                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200"
                      title="Delete Habit"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

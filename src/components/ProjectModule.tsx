/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { KanbanCard, Language } from '../types';
import { translate } from '../i18n';
import { LayoutDashboard, Plus, Trash2, ArrowLeft, ArrowRight, Tag, AlertTriangle } from 'lucide-react';
import { playClickSfx, playToggleSfx } from '../utils/sfx';

interface ProjectModuleProps {
  language: Language;
}

export default function ProjectModule({ language }: ProjectModuleProps) {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  
  // Modal/form trigger
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTag, setNewTag] = useState<'creative' | 'it' | 'student' | 'general'>('general');

  useEffect(() => {
    const saved = localStorage.getItem('kopispace_kanban');
    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (e) {}
    } else {
      setCards([
        { id: 'k-1', title: 'Rancang UI KopiSpace di Figma', description: 'Pelajari palette Cozy Cafe dan Persona 3 sloped style untuk mockup.', status: 'progress', priority: 'high', tag: 'creative', date: new Date().toLocaleDateString() },
        { id: 'k-2', title: 'Uji PWA Offline Service Worker', description: 'Pastikan file cached dimuat ketika network mati.', status: 'todo', priority: 'medium', tag: 'it', date: new Date().toLocaleDateString() },
        { id: 'k-3', title: 'Selesaikan Tugas Struktur Data', description: 'Kumpulkan sebelum jam 12 malam besok.', status: 'done', priority: 'low', tag: 'student', date: new Date().toLocaleDateString() }
      ]);
    }
  }, []);

  const saveCards = (updated: KanbanCard[]) => {
    setCards(updated);
    localStorage.setItem('kopispace_kanban', JSON.stringify(updated));
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playClickSfx();
    const newCard: KanbanCard = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      status: 'todo',
      priority: newPriority,
      tag: newTag,
      date: new Date().toLocaleDateString()
    };

    const updated = [...cards, newCard];
    saveCards(updated);

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setIsFormOpen(false);
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playToggleSfx();
    const updated = cards.filter(c => c.id !== id);
    saveCards(updated);
  };

  // Move status forwards or backwards
  const shiftCardStatus = (id: string, direction: 'back' | 'forward', e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSfx();
    const updated = cards.map(c => {
      if (c.id === id) {
        let newStatus = c.status;
        if (direction === 'forward') {
          if (c.status === 'todo') newStatus = 'progress';
          else if (c.status === 'progress') newStatus = 'done';
        } else {
          if (c.status === 'done') newStatus = 'progress';
          else if (c.status === 'progress') newStatus = 'todo';
        }
        return { ...c, status: newStatus };
      }
      return c;
    });
    saveCards(updated);
  };

  // Groups
  const cardsTodo = cards.filter(c => c.status === 'todo');
  const cardsProgress = cards.filter(c => c.status === 'progress');
  const cardsDone = cards.filter(c => c.status === 'done');

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      
      {/* Board Header Actions */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="text-[#3b82f6] w-6 h-6 animate-pulse" />
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">
            {translate('projectTitle', language)}
          </h2>
        </div>

        <button
          onClick={() => { playClickSfx(); setIsFormOpen(!isFormOpen); }}
          id="project-add-card-btn"
          className="flex items-center gap-1 px-4 py-2 bg-[#3b82f6] text-white font-extrabold text-xs uppercase -skew-x-6 border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-103 active:scale-95 transition-all duration-150"
        >
          <Plus size={14} /> {translate('addCard', language)}
        </button>
      </div>

      {/* Pop up form drawer inside module */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out border-[#eaccb2] bg-amber-50/50 dark:bg-[#1a1410] rounded-2xl ${
          isFormOpen ? 'max-h-[350px] p-5 border-2 mb-6' : 'max-h-0'
        }`}
      >
        <form onSubmit={handleCreateCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('cardTitle', language)}</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Rencana kerja..."
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none"
                required={isFormOpen}
              />
            </div>
            
            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('cardDesc', language)}</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Rincian subtask..."
                className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none h-16 resize-none"
              />
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">Tag Fokus</label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="w-full p-1.5 text-[11px] font-mono rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="creative">🎨 Creative</option>
                  <option value="it">💻 IT/Dev</option>
                  <option value="student">🎓 Student</option>
                  <option value="general">🌍 General</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full p-1.5 text-[11px] font-mono rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                id="kanban-save-btn"
                className="flex-1 py-2 bg-green-500 border-2 border-white text-white font-extrabold text-xs -skew-x-6 hover:scale-103 active:scale-95 transition-all duration-150"
              >
                💾 SAVE
              </button>
              <button
                type="button"
                onClick={() => { playClickSfx(); setIsFormOpen(false); }}
                className="flex-1 py-2 bg-zinc-400 border-2 border-white text-white font-extrabold text-xs -skew-x-6 hover:scale-103 active:scale-95 transition-all duration-150"
              >
                ❌ {translate('cancel', language)}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Columns Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        
        {/* Column wrapper helper function */}
        {[
          { title: translate('todoCol', language), list: cardsTodo, status: 'todo' as const, accent: 'border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#1a1410]' },
          { title: translate('progressCol', language), list: cardsProgress, status: 'progress' as const, accent: 'border-[#caad97] bg-amber-50/20 dark:bg-[#211914]' },
          { title: translate('doneCol', language), list: cardsDone, status: 'done' as const, accent: 'border-green-300 bg-green-50/10 dark:bg-green-950/5' }
        ].map((col) => (
          <div
            key={col.status}
            className={`flex flex-col border-2 rounded-2xl p-4 min-h-[350px] relative ${col.accent}`}
          >
            {/* Header label */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <span className="font-mono text-xs font-extrabold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 bg-[#3b82f6] -skew-x-12" />
                {col.title}
              </span>
              <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 font-mono font-bold px-2 py-0.5 rounded-lg text-zinc-500">
                {col.list.length}
              </span>
            </div>

            {/* List inner column */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[420px] scrollbar-thin">
              {col.list.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-[10px] font-mono">
                  {translate('emptyCard', language)}
                </div>
              ) : (
                col.list.map((card) => (
                  <div
                    key={card.id}
                    className="p-3.5 bg-white dark:bg-[#110c0a] border-2 border-zinc-200 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(59,130,246,0.3)] hover:shadow-[3px_3px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-0.5 transition-all duration-200 rounded-xl relative group"
                  >
                    
                    {/* Header meta badge */}
                    <div className="flex justify-between items-center mb-1">
                      <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold uppercase tracking-widest text-[#3b82f6]">
                        <Tag size={8} /> {card.tag}
                      </span>
                      
                      <button
                        onClick={(e) => handleDeleteCard(card.id, e)}
                        className="p-1 px-1.5 text-zinc-400 hover:text-red-500 rounded"
                        title="Delete card"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <h4 className="text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-100 tracking-wide line-clamp-2 uppercase">
                      {card.title}
                    </h4>
                    
                    <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 my-1.5 leading-snug line-clamp-3">
                      {card.description}
                    </p>

                    {/* Bottom row actions */}
                    <div className="mt-3.5 pt-2 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center gap-2">
                      <div className="flex gap-1">
                        <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${
                          card.priority === 'high'
                            ? 'bg-red-50 border-red-200 text-rose-500'
                            : card.priority === 'medium'
                            ? 'bg-yellow-50 border-yellow-250 text-yellow-500'
                            : 'bg-green-50 border-green-200 text-green-500'
                        }`}>
                          {card.priority}
                        </span>
                      </div>

                      {/* Interactive responsive navigation arrows */}
                      <div className="flex gap-1.5">
                        {card.status !== 'todo' && (
                          <button
                            onClick={(e) => shiftCardStatus(card.id, 'back', e)}
                            className="p-1 text-[#3b82f6] border border-zinc-300 hover:bg-zinc-150 rounded"
                            title="Move back"
                          >
                            <ArrowLeft size={11} />
                          </button>
                        )}
                        {card.status !== 'done' && (
                          <button
                            onClick={(e) => shiftCardStatus(card.id, 'forward', e)}
                            className="p-1 text-[#3b82f6] border border-zinc-300 hover:bg-zinc-150 rounded"
                            title="Move forward"
                          >
                            <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

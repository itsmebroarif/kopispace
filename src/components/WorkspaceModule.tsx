/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkspaceItem, Language } from '../types';
import { translate } from '../i18n';
import { Plus, Trash2, Search, FileText, Clipboard, Bold, Heading1, Heading2, List, Quote, Coffee } from 'lucide-react';
import { playClickSfx, playToggleSfx } from '../utils/sfx';

interface WorkspaceModuleProps {
  language: Language;
}

export default function WorkspaceModule({ language }: WorkspaceModuleProps) {
  const [pages, setPages] = useState<WorkspaceItem[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial mock pages if none exist, reflecting creative, IT, and student roles
  useEffect(() => {
    const saved = localStorage.getItem('kopispace_pages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPages(parsed);
        if (parsed.length > 0) {
          setSelectedPageId(parsed[0].id);
        }
      } catch (e) {
        initializeDefaultPages();
      }
    } else {
      initializeDefaultPages();
    }
  }, []);

  const initializeDefaultPages = () => {
    const defaultPages: WorkspaceItem[] = [
      {
        id: '1',
        title: '💡 Ide Kampanye Kreatif & Desain',
        content: '# Ide Desain Kafe Aesthetic\n\n## Mood Board Utama:\n- Cafe vibes hangat dengan filter cahaya kuning gading.\n- Palet warna: Cokelat tua, krem, biru cerah elektrik.\n\n## Rencana Aksi:\n1. Desain logo vector dengan cangkir kopi minimalis.\n2. Buat mockup antarmuka landing page.\n3. Cetak poster promosi di kanvas daur ulang.',
        lastModified: new Date().toLocaleString(),
        icon: '💡'
      },
      {
        id: '2',
        title: '💻 IT Sprint Rencana Deployment',
        content: '# Deployment Plan - Production\n\n## Checklist rilis akhir:\n- [x] Pastikan port server diikat ke 3000\n- [x] Buat file manifest.json && register serviceworker.js\n- [x] Sembunyikan API key rahasia di server-side\n- [ ] Buat index database untuk mempercepat query.',
        lastModified: new Date().toLocaleString(),
        icon: '💻'
      },
      {
        id: '3',
        title: '📚 Rangkuman Materi Pembelajaran',
        content: '# Struktur Data & Algoritma\n\n## Algoritma Pencarian Efektif:\n- *Binary Search* membutuhkan kompleksitas O(log N).\n- Pastikan array diurutkan terlebih dahulu!\n\n## Catatan Dosen:\n> "Pilihlah struktur data yang paling optimal sebelum menulis baris logika program pertama."',
        lastModified: new Date().toLocaleString(),
        icon: '📚'
      }
    ];
    setPages(defaultPages);
    setSelectedPageId('1');
    localStorage.setItem('kopispace_pages', JSON.stringify(defaultPages));
  };

  const savePages = (updated: WorkspaceItem[]) => {
    setPages(updated);
    localStorage.setItem('kopispace_pages', JSON.stringify(updated));
  };

  const handleCreatePage = () => {
    playClickSfx();
    const newPage: WorkspaceItem = {
      id: Date.now().toString(),
      title: translate('untitledPage', language),
      content: '',
      lastModified: new Date().toLocaleString(),
      icon: '✍️'
    };
    const updated = [newPage, ...pages];
    savePages(updated);
    setSelectedPageId(newPage.id);
  };

  const handleDeletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playToggleSfx();
    const updated = pages.filter(p => p.id !== id);
    savePages(updated);
    if (selectedPageId === id && updated.length > 0) {
      setSelectedPageId(updated[0].id);
    } else if (updated.length === 0) {
      setSelectedPageId('');
    }
  };

  const handleUpdatePageContent = (newContent: string) => {
    const updated = pages.map(p => {
      if (p.id === selectedPageId) {
        return {
          ...p,
          content: newContent,
          lastModified: new Date().toLocaleString()
        };
      }
      return p;
    });
    savePages(updated);
  };

  const handleUpdatePageTitle = (newTitle: string) => {
    const updated = pages.map(p => {
      if (p.id === selectedPageId) {
        return {
          ...p,
          title: newTitle,
          lastModified: new Date().toLocaleString()
        };
      }
      return p;
    });
    savePages(updated);
  };

  // Inject Markdown helpers into selected editor
  const injectMarkdown = (syntax: string) => {
    playClickSfx();
    const textarea = document.getElementById('notion-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);

    let replacement = syntax;
    if (syntax === 'bold') {
      replacement = `**${selected || 'teks tebal'}**`;
    } else if (syntax === 'h1') {
      replacement = `\n# ${selected || 'Heading 1'}\n`;
    } else if (syntax === 'h2') {
      replacement = `\n## ${selected || 'Heading 2'}\n`;
    } else if (syntax === 'list') {
      replacement = `\n- ${selected || 'Daftar item'}\n`;
    } else if (syntax === 'quote') {
      replacement = `\n> "${selected || 'Kutipan inspiratif'}"\n`;
    } else if (syntax === 'coffee') {
      replacement = `\n☕ *Nikmati secangkir espresso sambil melanjutkan inspirasi...*\n`;
    }

    const newContent = before + replacement + after;
    handleUpdatePageContent(newContent);
    
    // Focus back and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const selectIcon = (emoji: string) => {
    playClickSfx();
    const updated = pages.map(p => {
      if (p.id === selectedPageId) {
        return { ...p, icon: emoji };
      }
      return p;
    });
    savePages(updated);
  };

  const activePage = pages.find(p => p.id === selectedPageId);
  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Sidebar - Pages Listing (Left 4 cols) */}
      <div className="md:col-span-4 flex flex-col bg-[#faf6f0] dark:bg-[#1a1410] border-2 border-[#eaccb2] dark:border-[#3a281d] rounded-2xl p-4 shadow-sm">
        
        {/* Search & Actions */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder={translate('searchPages', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#1f1813] text-zinc-900 dark:text-[#f3e3d3] focus:outline-none focus:border-[#3b82f6]"
          />
        </div>

        <button
          onClick={handleCreatePage}
          id="workspace-add-page-btn"
          className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#3b82f6] text-white font-bold text-xs uppercase -skew-x-6 border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-103 active:scale-95 transition-all duration-150"
        >
          <Plus size={14} /> {translate('addPage', language)}
        </button>

        {/* List of Pages */}
        <div className="flex-1 overflow-y-auto max-h-[300px] md:max-h-[460px] space-y-1.5 pr-1">
          {filteredPages.length === 0 ? (
            <p className="text-zinc-400 text-[11px] font-mono text-center py-8">
              {translate('noPages', language)}
            </p>
          ) : (
            filteredPages.map(page => (
              <div
                key={page.id}
                onClick={() => {
                  playClickSfx();
                  setSelectedPageId(page.id);
                }}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer font-mono text-xs transition-all duration-200 border ${
                  selectedPageId === page.id
                    ? 'bg-[#3b82f6] text-white border-white font-bold -translate-x-1 shadow-md'
                    : 'bg-white dark:bg-[#1f1813] text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate flex-1">
                  <span className="text-sm">{page.icon}</span>
                  <span className="truncate">{page.title || translate('untitledPage', language)}</span>
                </div>

                <button
                  onClick={(e) => handleDeletePage(page.id, e)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded transition-all duration-200"
                  title={translate('deletePage', language)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Column - Editor Area (Right 8 cols) */}
      <div className="md:col-span-8 bg-[#fdfdfc] dark:bg-[#120d0a] border-4 border-[#3a281d] dark:border-zinc-700 rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(59,130,246,1)] flex flex-col relative overflow-hidden">
        
        {activePage ? (
          <div className="flex-1 flex flex-col">
            
            {/* Page Header Info */}
            <div className="mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                
                {/* Emoji Page Selector */}
                <div className="flex gap-1.5 p-1.5 bg-[#faf6f0] dark:bg-[#1a1410] border border-zinc-300 dark:border-zinc-800 rounded-lg">
                  {['📓', '💻', '💡', '📚', '☕', '🌟'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => selectIcon(emoji)}
                      className={`w-7 h-7 text-sm rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center justify-center ${
                        activePage.icon === emoji ? 'bg-zinc-200 dark:bg-zinc-700 scale-110' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                  {translate('lastEdit', language)}{activePage.lastModified}
                </span>
              </div>
            </div>

            {/* Title field */}
            <input
              type="text"
              value={activePage.title}
              onChange={(e) => handleUpdatePageTitle(e.target.value)}
              placeholder={translate('untitledPage', language)}
              className="w-full text-2xl font-extrabold tracking-tight border-none outline-none text-zinc-900 dark:text-white bg-transparent mb-3 placeholder-zinc-300 dark:placeholder-zinc-700"
            />

            {/* Notion Block Action Formatting Tools bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-100 dark:bg-[#1d1611] border border-zinc-200 dark:border-zinc-800 rounded-xl mb-4">
              <button
                onClick={() => injectMarkdown('h1')}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded"
                title="Heading 1"
              >
                <Heading1 size={14} />
              </button>
              <button
                onClick={() => injectMarkdown('h2')}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded"
                title="Heading 2"
              >
                <Heading2 size={14} />
              </button>
              <button
                onClick={() => injectMarkdown('bold')}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded font-bold"
                title="Bold Text"
              >
                <Bold size={14} />
              </button>
              <button
                onClick={() => injectMarkdown('list')}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded"
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => injectMarkdown('quote')}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded"
                title="Block Quote"
              >
                <Quote size={14} />
              </button>
              <button
                onClick={() => injectMarkdown('coffee')}
                className="p-1.5 bg-[#eedbc5] dark:bg-[#342418] hover:bg-orange-200 dark:hover:bg-orange-950 text-[#5c3e21] dark:text-[#be9874] rounded flex items-center gap-1 text-[10px] font-mono font-bold"
                title="Insert Cafe Quote"
              >
                <Coffee size={11} /> Cafe Space
              </button>
            </div>

            {/* Split view: Core editable area */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 h-full">
              
              {/* Write Side */}
              <div className="flex-1 flex flex-col">
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">Editor (Supports Markdown Syntax)</div>
                <textarea
                  id="notion-text-area"
                  value={activePage.content}
                  onChange={(e) => handleUpdatePageContent(e.target.value)}
                  placeholder={translate('notionPlaceholder', language)}
                  className="w-full flex-1 min-h-[220px] p-3 text-sm font-mono tracking-wide rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#1a1410] text-zinc-900 dark:text-amber-100 focus:outline-none focus:border-[#3b82f6] resize-none"
                />
              </div>

              {/* Dynamic live visual preview side */}
              <div className="flex-1 flex flex-col border-t-2 md:border-t-0 md:border-l-2 border-dashed border-zinc-200 dark:border-zinc-800 pt-4 md:pt-0 md:pl-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#3b82f6] mb-1">Markdown Render Preview</div>
                <div className="flex-1 min-h-[200px] p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#150f0c] text-zinc-800 dark:text-zinc-100 overflow-y-auto max-h-[300px] md:max-h-[460px] text-xs leading-relaxed">
                  {activePage.content.trim() === '' ? (
                    <span className="text-zinc-400 italic font-mono text-[11px]">Preview will appear here dynamically as you write...</span>
                  ) : (
                    <div className="prose dark:prose-invert font-mono max-w-none space-y-3">
                      {activePage.content.split('\n').map((line, idx) => {
                        if (line.startsWith('# ')) {
                          return <h2 key={idx} className="text-base font-extrabold border-b pb-1 text-[#3b82f6] uppercase">{line.replace('# ', '')}</h2>;
                        }
                        if (line.startsWith('## ')) {
                          return <h3 key={idx} className="text-xs font-bold text-amber-500 uppercase">{line.replace('## ', '')}</h3>;
                        }
                        if (line.startsWith('- ')) {
                          return <li key={idx} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                        }
                        if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
                          return <li key={idx} className="ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
                        }
                        if (line.startsWith('> ')) {
                          return <blockquote key={idx} className="border-l-4 border-[#3b82f6] pl-3 italic text-zinc-500 my-2 bg-zinc-50 dark:bg-zinc-900 py-1">{line.replace('> ', '')}</blockquote>;
                        }
                        if (line.trim().startsWith('- [x]')) {
                          return <div key={idx} className="flex items-center gap-2"><input type="checkbox" checked disabled className="accent-blue-500 rounded" /> <span className="line-through text-zinc-400">{line.replace('- [x]', '')}</span></div>;
                        }
                        if (line.trim().startsWith('- [ ]')) {
                          return <div key={idx} className="flex items-center gap-2"><input type="checkbox" disabled className="rounded" /> <span>{line.replace('- [ ]', '')}</span></div>;
                        }
                        return <p key={idx} className="min-h-[1em]">{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
            <Clipboard size={44} className="mb-2 text-[#3b82f6] animate-pulse" />
            <h3 className="font-mono text-sm uppercase">{translate('untitledPage', language)}</h3>
            <p className="font-mono text-xs max-w-sm mt-1">{translate('noPages', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

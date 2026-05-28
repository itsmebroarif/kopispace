/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Contact, Language } from '../types';
import { translate } from '../i18n';
import { Users, Plus, Trash2, Search, Mail, Phone, Tag, BookOpen } from 'lucide-react';
import { playClickSfx, playToggleSfx } from '../utils/sfx';

interface ContactModuleProps {
  language: Language;
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-indigo-500', 'bg-pink-500'
];

export default function ContactModule({ language }: ContactModuleProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('kopispace_contacts');
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (e) {}
    } else {
      setContacts([
        { id: '1', name: 'Aris Prasetyo', role: '🎨 UI Designer & Motion Animator', email: 'aris@kopispace.io', phone: '+62 812-3456-7890', note: 'Partner kolaborasi proyek visual branding kafe.', avatarColor: 'bg-emerald-500' },
        { id: '2', name: 'Rina Wijaya', role: '💻 IT System Architect', email: 'rina@devlounge.net', phone: '+62 821-4433-2211', note: 'Sangat mengerti integrasi cloud database & API service.', avatarColor: 'bg-blue-500' },
        { id: '3', name: 'Takashi Sato', role: '🎓 Student / Translator', email: 'sato@kobe-u.ac.jp', phone: '+81 90-1234-5678', note: 'Membantu riset penerjemahan lokalisasi bahasa Jepang.', avatarColor: 'bg-indigo-500' }
      ]);
    }
  }, []);

  const saveContacts = (updated: Contact[]) => {
    setContacts(updated);
    localStorage.setItem('kopispace_contacts', JSON.stringify(updated));
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    playClickSfx();
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      role,
      email,
      phone,
      note,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    };

    const updated = [newContact, ...contacts];
    saveContacts(updated);

    // Reset
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setNote('');
    setIsFormOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    playToggleSfx();
    const updated = contacts.filter(c => c.id !== id);
    saveContacts(updated);
  };

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      
      {/* Search and action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-[#3b82f6] w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-zinc-900 dark:text-white">
            {translate('contactTitle', language)}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Contacts input */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder={translate('searchContacts', language)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 focus:outline-none"
            />
          </div>

          <button
            onClick={() => { playClickSfx(); setIsFormOpen(!isFormOpen); }}
            id="contact-add-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-1 px-4 py-2 bg-[#3b82f6] text-white font-extrabold text-xs uppercase -skew-x-6 border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:scale-103 active:scale-95 transition-all duration-150"
          >
            <Plus size={14} /> {translate('addContact', language)}
          </button>
        </div>
      </div>

      {/* Pop up form drawer inside module */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out border-[#eaccb2] bg-amber-50/50 dark:bg-[#1a1410] rounded-2xl ${
          isFormOpen ? 'max-h-[380px] p-5 border-2 mb-6' : 'max-h-0'
        }`}
      >
        <form onSubmit={handleAddContact} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('contactName', language)}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: Aris Prasetyo"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none"
                required={isFormOpen}
              />
            </div>
            
            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('contactRole', language)}</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="cth: UI Designer / Student"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none"
                required={isFormOpen}
              />
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('contactEmail', language)}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('contactPhone', language)}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 ..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('contactNote', language)}</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="info tambahan..."
                className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                id="contact-save-btn"
                className="flex-1 py-1.5 bg-[#3b82f6] border-2 border-white text-white font-extrabold text-xs -skew-x-6 hover:scale-103 active:scale-95 transition-all duration-150"
              >
                💾 SAVE
              </button>
              <button
                type="button"
                onClick={() => { playClickSfx(); setIsFormOpen(false); }}
                className="flex-1 py-1.5 bg-zinc-400 border-2 border-white text-white font-extrabold text-xs -skew-x-6 hover:scale-103"
              >
                ❌ {translate('cancel', language)}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Grid listing directory visualized as professional identity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 font-mono text-zinc-400 text-xs">
            👥 {translate('emptyContacts', language)}
          </div>
        ) : (
          filtered.map((contact) => (
            <div
              key={contact.id}
              className="p-5 bg-white dark:bg-[#110c0a] border-4 border-[#3a281d] rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] hover:-translate-y-1 transition-all duration-200 flex flex-col relative overflow-hidden"
            >
              
              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5 mb-4 pb-2.5 border-b border-dashed border-zinc-200 dark:border-zinc-800">
                <div className={`w-11 h-11 rounded-full ${contact.avatarColor} text-white flex items-center justify-center font-mono font-extrabold shadow-sm border-2 border-white shrink-0 -skew-x-3`}>
                  {contact.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="truncate flex-1">
                  <h4 className="text-sm font-mono font-extrabold text-zinc-800 dark:text-zinc-100 truncate tracking-wide uppercase">
                    {contact.name}
                  </h4>
                  <p className="text-[10px] font-mono font-semibold text-[#3b82f6] truncate uppercase mt-0.5">
                    {contact.role}
                  </p>
                </div>
              </div>

              {/* Coordinates rows */}
              <div className="space-y-2 flex-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={12} className="text-zinc-400 shrink-0" />
                    <span className="truncate hover:text-[#3b82f6] cursor-pointer" title={contact.email}>
                      {contact.email}
                    </span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={12} className="text-zinc-400 shrink-0" />
                    <span className="truncate hover:text-[#3b82f6] cursor-pointer" title={contact.phone}>
                      {contact.phone}
                    </span>
                  </div>
                )}
                {contact.note && (
                  <div className="mt-3 p-2 bg-[#faf6f0] dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 rounded-lg text-[10px] italic leading-snug">
                    {contact.note}
                  </div>
                )}
              </div>

              {/* Actions row footer */}
              <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-900 text-right">
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-1 px-2.5 bg-red-50 dark:bg-red-950/20 text-rose-500 text-[10px] font-mono font-extrabold border border-red-200 dark:border-red-900 rounded-lg uppercase hover:bg-rose-500 hover:text-white transition-all duration-150"
                  title="Remove Contact"
                >
                  <Trash2 size={11} className="inline mr-1" /> Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'id' | 'en' | 'jp';
export type DesignStyle = 'cupertino' | 'material';
export type ThemeMode = 'dark' | 'light';

export interface WorkspaceItem {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  icon: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  category: 'work' | 'creative' | 'study' | 'personal';
  priority: 'low' | 'medium' | 'high';
}

export interface HabitItem {
  id: string;
  name: string;
  streak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  history: string[]; // List of YYYY-MM-DD dates completed
}

export interface TransactionItem {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  tag: 'creative' | 'it' | 'student' | 'general';
  date: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  note: string;
  avatarColor: string;
}

export interface BgmPreset {
  id: string;
  title: string;
  artist: string;
  genre: 'lofi' | 'espresso' | 'rain' | 'chill';
  isPlaying: boolean;
}

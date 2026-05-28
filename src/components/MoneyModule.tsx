/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TransactionItem, Language } from '../types';
import { translate } from '../i18n';
import { Wallet, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw, Calculator, Coffee } from 'lucide-react';
import { playClickSfx, playToggleSfx } from '../utils/sfx';

interface MoneyModuleProps {
  language: Language;
}

export default function MoneyModule({ language }: MoneyModuleProps) {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  
  // Form values
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCategory, setTxCategory] = useState('Makanan/Minuman');

  // Load from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('kopispace_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {}
    } else {
      // Pre-seed some transactions suitable for creatives/students
      setTransactions([
        { id: 'tx-1', title: 'Pembayaran Fee Freelance Desain', amount: 1500000, type: 'income', date: new Date().toLocaleDateString(), category: 'Project Fee' },
        { id: 'tx-2', title: 'Espresso & Butter Croissant', amount: 45000, type: 'expense', date: new Date().toLocaleDateString(), category: 'Café Coffee' },
        { id: 'tx-3', title: 'Langganan Hosting Server Vercel', amount: 300000, type: 'expense', date: new Date().toLocaleDateString(), category: 'IT Tools' },
        { id: 'tx-4', title: 'Beasiswa Bulanan', amount: 800000, type: 'income', date: new Date().toLocaleDateString(), category: 'Edukasi' }
      ]);
    }
  }, []);

  const saveTransactions = (updated: TransactionItem[]) => {
    setTransactions(updated);
    localStorage.setItem('kopispace_transactions', JSON.stringify(updated));
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount.trim()) return;

    playClickSfx();
    const cleanAmount = parseFloat(txAmount.replace(/[^0-9.-]+/g, ""));
    if (isNaN(cleanAmount) || cleanAmount <= 0) return;

    const newTx: TransactionItem = {
      id: Date.now().toString(),
      title: txTitle,
      amount: cleanAmount,
      type: txType,
      date: new Date().toLocaleDateString(),
      category: txCategory
    };

    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    
    // Reset form fields
    setTxTitle('');
    setTxAmount('');
  };

  const handleDeleteTransaction = (id: string) => {
    playToggleSfx();
    const updated = transactions.filter(t => t.id !== id);
    saveTransactions(updated);
  };

  // Finance analysis totals
  const totalIncomes = transactions.filter(t => t.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, c) => acc + c.amount, 0);
  const netBalance = totalIncomes - totalExpenses;

  // Formatting currency in IDR Rupiah
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Finance Balance Overhead Dashboard Cards (Left 4 columns) */}
      <div className="lg:col-span-4 flex flex-col space-y-5">
        
        {/* Net balance card, highly animated skew look */}
        <div className="p-6 bg-[#18120e] text-white border-4 border-[#3a281d] rounded-3xl shadow-[5px_5px_0px_0px_rgba(59,130,246,1)] relative overflow-hidden -skew-x-1.5 hover:rotate-1 transition-transform">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#3b82f6] -translate-y-10 translate-x-10 rotate-45 opacity-25" />
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            <Wallet size={12} className="text-[#3b82f6]" /> {translate('totalBalance', language)}
          </div>
          <p className="text-2xl font-mono font-extrabold tracking-wide text-[#3b82f6] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            {formatIDR(netBalance)}
          </p>
          <div className="mt-4 flex gap-3 text-[10px] font-mono text-zinc-400 pt-3 border-t border-[#31251c]">
            <div>In: <span className="text-green-400 font-bold">{formatIDR(totalIncomes)}</span></div>
            <div>Out: <span className="text-rose-400 font-bold">{formatIDR(totalExpenses)}</span></div>
          </div>
        </div>

        {/* Form to submit transaction */}
        <div className="p-5 bg-white dark:bg-[#120d0a] border-4 border-[#3a281d] rounded-2xl shadow-sm">
          <h3 className="font-extrabold text-xs uppercase tracking-wider mb-3 text-zinc-900 dark:text-white flex items-center gap-1.5 border-b pb-2">
            <Plus size={14} className="text-[#3b82f6]" /> {translate('addTransaction', language)}
          </h3>

          <form onSubmit={handleAddTransaction} className="space-y-3.5">
            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('txName', language)}</label>
              <input
                type="text"
                value={txTitle}
                onChange={(e) => setTxTitle(e.target.value)}
                placeholder="cth: Gaji Freelance / Kopi Latte"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none focus:border-[#3b82f6]"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('amount', language)}</label>
              <input
                type="number"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="nominal Rp"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-orange-100 focus:outline-none focus:border-[#3b82f6]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">{translate('category', language)}</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full p-1.5 text-[11px] font-mono rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="Freelance Fee">💼 Freelance Fee</option>
                  <option value="Uang Jajan">🏡 Uang Jajan</option>
                  <option value="Edukasi/Buku">🎓 Edukasi/Buku</option>
                  <option value="Café Coffee">☕ Café Coffee</option>
                  <option value="IT Tools">💻 IT Tools</option>
                  <option value="Sewa Kost">🏠 Sewa Kost</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-mono text-zinc-400 mb-1">Type Cash</label>
                <div className="flex border-2 border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 bg-zinc-100 dark:bg-zinc-900 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => { playClickSfx(); setTxType('income'); }}
                    className={`flex-1 text-center py-1 font-bold rounded ${
                      txType === 'income' ? 'bg-green-500 text-white' : 'text-zinc-500'
                    }`}
                  >
                    IN
                  </button>
                  <button
                    type="button"
                    onClick={() => { playClickSfx(); setTxType('expense'); }}
                    className={`flex-1 text-center py-1 font-bold rounded ${
                      txType === 'expense' ? 'bg-rose-500 text-white' : 'text-zinc-500'
                    }`}
                  >
                    OUT
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="money-add-tx-btn"
              className="w-full py-2 bg-[#3b82f6] border-2 border-white text-white font-extrabold text-xs tracking-wider -skew-x-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:scale-103 active:scale-95 transition-all duration-150"
            >
              💵 RECORD
            </button>
          </form>
        </div>
      </div>

      {/* Ledger transactions list (Right 8 columns) */}
      <div className="lg:col-span-8 bg-[#fdfdfc] dark:bg-[#120d0a] border-4 border-[#3a281d] rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(59,130,246,1)] flex flex-col max-h-[500px]">
        
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-4">
          <Calculator className="text-zinc-400" />
          <h2 className="text-lg font-bold uppercase tracking-tight text-zinc-950 dark:text-white">
            {translate('recentTransactions', language)}
          </h2>
        </div>

        {/* Ledger view */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {transactions.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 text-xs font-mono">
              📥 {translate('emptyTx', language)}
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-[#191310] border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-[#3b82f6] transition-all duration-200"
              >
                <div className="truncate flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    {tx.type === 'income' ? (
                      <TrendingUp size={14} className="text-green-500 shrink-0" />
                    ) : (
                      <TrendingDown size={14} className="text-rose-500 shrink-0" />
                    )}
                    <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100 block truncate">
                      {tx.title}
                    </span>
                  </div>
                  
                  <div className="flex gap-2.5 items-center mt-1 font-mono text-[9px]">
                    <span className="text-zinc-400 uppercase tracking-wider">{tx.date}</span>
                    <span className="text-zinc-400">•</span>
                    <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded truncate max-w-[120px]">
                      {tx.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs font-extrabold ${
                      tx.type === 'income' ? 'text-green-500' : 'text-rose-500'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
                  </span>

                  <button
                    onClick={() => handleDeleteTransaction(tx.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg"
                    title="Delete Record"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

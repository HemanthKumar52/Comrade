'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, TrendingUp, PieChart, ArrowRight, Plus, X,
  Utensils, Car, Hotel, Ticket, ShoppingBag, MoreHorizontal,
  Download, Receipt, ChevronDown, ChevronUp, Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Transport: Car,
  Accommodation: Hotel,
  Activities: Ticket,
  Shopping: ShoppingBag,
  Other: MoreHorizontal,
};

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-100 text-orange-700',
  Transport: 'bg-blue-100 text-blue-700',
  Accommodation: 'bg-purple-100 text-purple-700',
  Activities: 'bg-green-100 text-green-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

const categoryBarColors: Record<string, string> = {
  Food: 'bg-orange-500',
  Transport: 'bg-blue-500',
  Accommodation: 'bg-purple-500',
  Activities: 'bg-green-500',
  Shopping: 'bg-pink-500',
  Other: 'bg-gray-500',
};

const mockExpenses = [
  { id: 1, amount: 2400, currency: 'INR', category: 'Food', description: 'Seafood dinner at Martin\'s Corner', date: '2026-03-05', paidBy: 'Arjun' },
  { id: 2, amount: 800, currency: 'INR', category: 'Transport', description: 'Scooter rental - day 1', date: '2026-03-05', paidBy: 'Priya' },
  { id: 3, amount: 5500, currency: 'INR', category: 'Accommodation', description: 'Beach hut - 1 night', date: '2026-03-05', paidBy: 'Arjun' },
  { id: 4, amount: 1200, currency: 'INR', category: 'Activities', description: 'Dolphin watching boat trip', date: '2026-03-06', paidBy: 'Priya' },
  { id: 5, amount: 650, currency: 'INR', category: 'Food', description: 'Breakfast at Britto\'s', date: '2026-03-06', paidBy: 'Arjun' },
  { id: 6, amount: 3200, currency: 'INR', category: 'Shopping', description: 'Spice market haul', date: '2026-03-06', paidBy: 'Priya' },
  { id: 7, amount: 900, currency: 'INR', category: 'Transport', description: 'Taxi to Old Goa churches', date: '2026-03-07', paidBy: 'Arjun' },
  { id: 8, amount: 1800, currency: 'INR', category: 'Food', description: 'Fish thali lunch at Ritz Classic', date: '2026-03-07', paidBy: 'Priya' },
  { id: 9, amount: 2500, currency: 'INR', category: 'Activities', description: 'Parasailing at Calangute', date: '2026-03-07', paidBy: 'Arjun' },
  { id: 10, amount: 450, currency: 'INR', category: 'Other', description: 'Pharmacy - sunscreen & meds', date: '2026-03-08', paidBy: 'Priya' },
];

const settlements = [
  { from: 'Priya', to: 'Arjun', amount: 1575 },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(mockExpenses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ amount: '', currency: 'INR', category: 'Food', description: '', paidBy: '' });
  const [selectedTrip] = useState('Goa Trip - Mar 2026');

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const dailyAvg = Math.round(totalSpent / 4);
  const categoryBreakdown = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  const biggestCategory = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0];

  const handleAdd = () => {
    if (newExpense.amount && newExpense.description) {
      setExpenses([
        { id: Date.now(), amount: Number(newExpense.amount), currency: newExpense.currency, category: newExpense.category, description: newExpense.description, date: new Date().toISOString().split('T')[0], paidBy: newExpense.paidBy || 'You' },
        ...expenses,
      ]);
      setNewExpense({ amount: '', currency: 'INR', category: 'Food', description: '', paidBy: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3C5E]">Trip Expenses</h1>
          <p className="text-gray-500 text-sm">Track, split, and settle trip costs</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="border rounded-md px-3 py-2 text-sm bg-white">
            <option>{selectedTrip}</option>
            <option>Ladakh Trip - Jan 2026</option>
          </select>
          <Button size="sm" variant="outline" className="gap-1 text-[#1A3C5E] border-[#1A3C5E]/30">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Spent', value: `₹${totalSpent.toLocaleString()}`, icon: Wallet, color: 'text-[#E8733A]' },
          { label: 'Daily Average', value: `₹${dailyAvg.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Biggest Category', value: biggestCategory ? biggestCategory[0] : '-', icon: PieChart, color: 'text-purple-500' },
          { label: 'Transactions', value: expenses.length.toString(), icon: Receipt, color: 'text-green-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={cn('w-5 h-5', stat.color)} />
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
              <p className="text-xl font-bold text-[#1A3C5E]">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Add Expense */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-2 mb-4" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? 'Cancel' : 'Add Expense'}
        </Button>
        <AnimatePresence>
          {showAddForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Card className="border-[#E8733A]/30 mb-4">
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Amount</label>
                      <Input type="number" placeholder="0" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Currency</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-white" value={newExpense.currency} onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}>
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Category</label>
                      <select className="w-full border rounded-md px-3 py-2 text-sm bg-white" value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}>
                        {Object.keys(categoryIcons).map((c) => (<option key={c} value={c}>{c}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Paid By</label>
                      <Input placeholder="Name" value={newExpense.paidBy} onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })} />
                    </div>
                  </div>
                  <Input placeholder="Description" value={newExpense.description} onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} />
                  <div className="flex items-center gap-3">
                    <Button size="sm" variant="outline" className="gap-1 text-xs text-gray-500">
                      <Upload className="w-3 h-3" /> Attach Receipt
                    </Button>
                    <div className="flex-1" />
                    <Button className="bg-[#1A3C5E] hover:bg-[#15334f]" onClick={handleAdd}>Save Expense</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Expense List */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4">All Expenses</h2>
        <div className="space-y-2">
          {expenses.map((exp, i) => {
            const Icon = categoryIcons[exp.category] || MoreHorizontal;
            return (
              <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', categoryColors[exp.category])}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A3C5E] truncate">{exp.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="outline" className="text-xs">{exp.category}</Badge>
                          <span>{exp.date}</span>
                          <span>&middot; Paid by {exp.paidBy}</span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[#1A3C5E] shrink-0">₹{exp.amount.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Category Breakdown */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#E8733A]" /> Category Breakdown
        </h2>
        <Card>
          <CardContent className="pt-4 space-y-3">
            {Object.entries(categoryBreakdown)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => {
                const pct = Math.round((amount / totalSpent) * 100);
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#1A3C5E]">{cat}</span>
                      <span className="text-sm text-gray-600">₹{amount.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', categoryBarColors[cat] || 'bg-gray-400')}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </motion.section>

      {/* Settlements */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-lg font-semibold text-[#1A3C5E] mb-4">Settlements</h2>
        <div className="space-y-3">
          {settlements.map((s, i) => (
            <Card key={i} className="border-[#E8733A]/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1A3C5E] text-white flex items-center justify-center text-xs font-bold">{s.from[0]}</div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="w-8 h-8 rounded-full bg-[#E8733A] text-white flex items-center justify-center text-xs font-bold">{s.to[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-[#1A3C5E]">{s.from} owes {s.to}</p>
                      <p className="text-lg font-bold text-[#E8733A]">₹{s.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-[#1A3C5E] hover:bg-[#15334f]">Settle</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

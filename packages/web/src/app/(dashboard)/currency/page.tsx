'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft, DollarSign, Calculator, Receipt, TrendingUp,
  Plus, Utensils, Car, Hotel, ShoppingBag, Ticket, Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
];

const mockRates: Record<string, Record<string, number>> = {
  USD: { INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 149.5, THB: 35.2, USD: 1 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, THB: 0.42, INR: 1 },
  EUR: { USD: 1.09, INR: 90.8, GBP: 0.86, JPY: 162.5, THB: 38.3, EUR: 1 },
  GBP: { USD: 1.27, INR: 105.7, EUR: 1.16, JPY: 189.2, THB: 44.6, GBP: 1 },
  JPY: { USD: 0.0067, INR: 0.56, EUR: 0.0062, GBP: 0.0053, THB: 0.24, JPY: 1 },
  THB: { USD: 0.028, INR: 2.37, EUR: 0.026, GBP: 0.022, JPY: 4.24, THB: 1 },
};

const budgetCategories = [
  { name: 'Accommodation', icon: Hotel, spent: 15000, budget: 25000, color: '#3B82F6' },
  { name: 'Food', icon: Utensils, spent: 8000, budget: 12000, color: '#E8733A' },
  { name: 'Transport', icon: Car, spent: 5500, budget: 8000, color: '#10B981' },
  { name: 'Activities', icon: Ticket, spent: 3000, budget: 6000, color: '#8B5CF6' },
  { name: 'Shopping', icon: ShoppingBag, spent: 4500, budget: 5000, color: '#F59E0B' },
];

const recentExpenses = [
  { id: '1', description: 'Hotel Taj Palace', amount: 5500, currency: 'INR', category: 'Accommodation', icon: Hotel, date: 'Today' },
  { id: '2', description: 'Lunch at Spice Garden', amount: 850, currency: 'INR', category: 'Food', icon: Utensils, date: 'Today' },
  { id: '3', description: 'Uber to Fort', amount: 350, currency: 'INR', category: 'Transport', icon: Car, date: 'Yesterday' },
  { id: '4', description: 'Museum Entry', amount: 500, currency: 'INR', category: 'Activities', icon: Ticket, date: 'Yesterday' },
  { id: '5', description: 'Handicraft Souvenirs', amount: 2200, currency: 'INR', category: 'Shopping', icon: ShoppingBag, date: '2 days ago' },
];

const mockTrips = [
  { id: '1', title: 'Rajasthan Heritage Tour' },
  { id: '2', title: 'Goa Beach Getaway' },
  { id: '3', title: 'Kerala Backwaters' },
];

export default function CurrencyPage() {
  // Converter state
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  // Tip calculator state
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [splitCount, setSplitCount] = useState(1);
  const [customTip, setCustomTip] = useState('');

  // Budget state
  const [selectedTrip, setSelectedTrip] = useState('1');

  // Converter logic
  const rate = mockRates[fromCurrency]?.[toCurrency] || 0;
  const convertedAmount = amount ? (parseFloat(amount) * rate) : 0;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Tip logic
  const activeTip = customTip ? parseFloat(customTip) : tipPercent;
  const tipValue = billAmount ? parseFloat(billAmount) * (activeTip / 100) : 0;
  const totalWithTip = billAmount ? parseFloat(billAmount) + tipValue : 0;
  const perPerson = splitCount > 0 ? totalWithTip / splitCount : totalWithTip;

  // Budget logic
  const totalBudget = budgetCategories.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0);
  const dailyAvg = Math.round(totalSpent / 5);

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency);
  const toCurrencyData = currencies.find((c) => c.code === toCurrency);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[#1A3C5E]">Currency & Finance</h1>
        <p className="text-gray-500 text-sm">Manage your travel finances smartly</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Converter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#E8733A]" />
                Currency Converter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg h-12"
                />
              </div>

              {/* From/To selectors */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={swapCurrencies}
                  className="mt-5 rounded-full border border-gray-200 hover:bg-[#E8733A]/10 hover:border-[#E8733A] shrink-0"
                >
                  <ArrowRightLeft className="w-4 h-4 text-[#E8733A]" />
                </Button>

                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              {amount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-gradient-to-r from-[#1A3C5E] to-[#2a5a8a] rounded-xl text-white"
                >
                  <p className="text-xs text-white/60 mb-1">Converted Amount</p>
                  <p className="text-3xl font-bold">
                    {toCurrencyData?.symbol}{convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tip Calculator */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#E8733A]" />
                Tip Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bill Amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Bill Amount</label>
                <Input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="Enter bill amount"
                  className="h-11"
                />
              </div>

              {/* Tip Percentage */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tip Percentage</label>
                <div className="flex gap-2 flex-wrap">
                  {[10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => { setTipPercent(pct); setCustomTip(''); }}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                        tipPercent === pct && !customTip
                          ? 'bg-[#E8733A] text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )}
                    >
                      {pct}%
                    </button>
                  ))}
                  <Input
                    type="number"
                    value={customTip}
                    onChange={(e) => setCustomTip(e.target.value)}
                    placeholder="Custom %"
                    className="w-24 h-9"
                  />
                </div>
              </div>

              {/* Split */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Split Between</label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSplitCount(Math.max(1, splitCount - 1))}
                    className="h-9 w-9"
                  >
                    -
                  </Button>
                  <span className="text-lg font-bold text-[#1A3C5E] w-8 text-center">{splitCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSplitCount(splitCount + 1)}
                    className="h-9 w-9"
                  >
                    +
                  </Button>
                  <span className="text-sm text-gray-500">
                    {splitCount === 1 ? 'person' : 'people'}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Result */}
              {billAmount && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-gray-50 rounded-xl space-y-2"
                >
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tip ({customTip || tipPercent}%)</span>
                    <span className="font-medium">₹{tipValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total with Tip</span>
                    <span className="font-medium">₹{totalWithTip.toFixed(2)}</span>
                  </div>
                  {splitCount > 1 && <Separator />}
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#1A3C5E]">
                      {splitCount > 1 ? 'Per Person' : 'You Pay'}
                    </span>
                    <span className="text-[#E8733A]">₹{perPerson.toFixed(2)}</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Budget Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#E8733A]" />
                Budget Overview
              </CardTitle>
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8733A]/30"
              >
                {mockTrips.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Total Budget</p>
                <p className="text-xl font-bold text-[#1A3C5E]">₹{totalBudget.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-[#E8733A]/5 rounded-xl">
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-[#E8733A]">₹{totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-gray-500">Daily Average</p>
                <p className="text-xl font-bold text-green-600">₹{dailyAvg.toLocaleString()}</p>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-4">
              {budgetCategories.map((cat, index) => {
                const pct = Math.round((cat.spent / cat.budget) * 100);
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ₹{cat.spent.toLocaleString()} / ₹{cat.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.4 + index * 0.05 }}
                        className={cn('h-full rounded-full', pct > 90 ? 'bg-red-500' : '')}
                        style={{ backgroundColor: pct <= 90 ? cat.color : undefined }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Expenses */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-400" />
              Recent Expenses
            </CardTitle>
            <Button className="bg-[#E8733A] hover:bg-[#d4642e] gap-1.5" size="sm">
              <Plus className="w-3.5 h-3.5" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A3C5E]/8 flex items-center justify-center">
                      <expense.icon className="w-5 h-5 text-[#1A3C5E]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A3C5E]">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {expense.category}
                        </Badge>
                        <span className="text-[10px] text-gray-400">{expense.date}</span>
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-[#1A3C5E]">
                    ₹{expense.amount.toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

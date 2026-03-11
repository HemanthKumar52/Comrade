'use client';
import * as React from 'react';
import { ArrowRightLeft, DollarSign, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const currencies = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

interface CurrencyConverterProps {
  onConvert?: (amount: number, from: string, to: string) => Promise<{
    result: number;
    rate: number;
  }>;
}

export function CurrencyConverter({ onConvert }: CurrencyConverterProps) {
  const [amount, setAmount] = React.useState('1000');
  const [fromCurrency, setFromCurrency] = React.useState('INR');
  const [toCurrency, setToCurrency] = React.useState('USD');
  const [result, setResult] = React.useState<number | null>(null);
  const [rate, setRate] = React.useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [loading, setLoading] = React.useState(false);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setRate(null);
  };

  const handleConvert = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !onConvert) return;

    setLoading(true);
    try {
      const res = await onConvert(numAmount, fromCurrency, toCurrency);
      setResult(res.result);
      setRate(res.rate);
      setLastUpdated(new Date());
    } catch {
      setResult(null);
      setRate(null);
    } finally {
      setLoading(false);
    }
  };

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency);
  const toCurrencyData = currencies.find((c) => c.code === toCurrency);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-5 w-5 text-accent" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          placeholder="Enter amount"
          icon={<span className="text-sm font-medium">{fromCurrencyData?.symbol || '$'}</span>}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Currency selectors */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              From
            </label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="ghost" size="icon" onClick={swap} className="mb-0.5 shrink-0">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              To
            </label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Convert button */}
        <Button
          variant="accent"
          className="w-full"
          onClick={handleConvert}
          disabled={loading || !amount}
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            'Convert'
          )}
        </Button>

        {/* Result */}
        {result !== null && (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {toCurrencyData?.symbol}
              {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {rate !== null && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </p>
            )}
            {lastUpdated && (
              <p className="mt-1 text-[10px] text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

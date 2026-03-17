'use client';

import { useState } from 'react';
import { calculateMortgage, formatPrice } from '@/lib/utils';
import { Calculator } from 'lucide-react';

interface MortgageCalculatorProps {
  price: number;
  currency: string;
}

export function MortgageCalculator({ price, currency }: MortgageCalculatorProps) {
  const [deposit, setDeposit] = useState(Math.round(price * 0.2));
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  const principal = price - deposit;
  const monthly = principal > 0 ? calculateMortgage(principal, rate, years) : 0;
  const total = monthly * years * 12;
  const totalInterest = total - principal;

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-brand-600" />
        <h3 className="font-semibold text-gray-900">Mortgage calculator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Deposit ({Math.round((deposit / price) * 100)}%)</label>
          <input type="range" min={0} max={price} step={1000} value={deposit} onChange={(e) => setDeposit(+e.target.value)} className="w-full accent-brand-600" />
          <div className="text-sm font-medium text-gray-900 mt-1">{formatPrice(deposit, currency)}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Interest rate (%)</label>
          <input type="number" min={0.1} max={20} step={0.1} value={rate} onChange={(e) => setRate(+e.target.value)} className="input text-sm" />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">Term (years)</label>
          <select value={years} onChange={(e) => setYears(+e.target.value)} className="input text-sm">
            {[10, 15, 20, 25, 30, 35].map((y) => <option key={y} value={y}>{y} years</option>)}
          </select>
        </div>

        <div className="bg-brand-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Monthly payment</span>
            <span className="font-bold text-brand-700 text-base">{formatPrice(monthly, currency)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Loan amount</span>
            <span>{formatPrice(principal, currency)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Total interest</span>
            <span>{formatPrice(totalInterest, currency)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400">* Indicative only. Consult a financial advisor for accurate figures.</p>
      </div>
    </div>
  );
}

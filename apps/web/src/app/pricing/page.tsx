import { Check } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | WorldPropertyFinder',
  description: 'Simple, transparent pricing for agents and agencies.',
};

const plans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for individual agents just getting started.',
    features: ['Up to 10 active listings', 'Basic analytics', 'Email support', 'Contact form leads'],
    cta: 'Get started',
    href: '/auth/register',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: 79,
    description: 'For active agents who need more visibility.',
    features: ['Up to 50 active listings', 'Featured placement', 'Advanced analytics', 'Priority support', 'Virtual tour support', 'Lead management CRM'],
    cta: 'Start free trial',
    href: '/auth/register',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: 199,
    description: 'For agencies managing multiple agents and listings.',
    features: ['Unlimited listings', 'Team management', 'API access', 'Dedicated account manager', 'Full analytics suite'],
    cta: 'Contact sales',
    href: '/auth/register',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Choose the plan that fits your business. All plans include a 14-day free trial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlighted
                ? 'border-brand-600 bg-brand-600 text-white shadow-xl scale-105'
                : 'border-gray-200 bg-white text-gray-900'
            }`}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
              <p className={`text-sm mb-4 ${plan.highlighted ? 'text-brand-100' : 'text-gray-500'}`}>
                {plan.description}
              </p>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className={`text-sm mb-1 ${plan.highlighted ? 'text-brand-100' : 'text-gray-400'}`}>/month</span>
              </div>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className={`w-4 h-4 shrink-0 ${plan.highlighted ? 'text-brand-200' : 'text-brand-600'}`} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`block text-center py-3 px-6 rounded-xl font-medium transition-colors ${
                plan.highlighted
                  ? 'bg-white text-brand-700 hover:bg-brand-50'
                  : 'bg-brand-600 text-white hover:bg-brand-700'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-400 mt-10">
        All prices in USD. Cancel anytime. No hidden fees.
      </p>
    </div>
  );
}

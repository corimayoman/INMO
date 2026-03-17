import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const benefits = [
  'List unlimited properties',
  'Manage leads and inquiries',
  'Analytics and performance insights',
  'AI-powered listing descriptions',
  'Calendar and viewing management',
];

export function AgentCTA() {
  return (
    <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="badge-gold mb-4 inline-block">For Agents & Agencies</span>
            <h2 className="text-3xl font-bold mb-4">Grow your real estate business globally</h2>
            <p className="text-brand-200 mb-8 leading-relaxed">
              Join thousands of agents and agencies using WorldPropertyFinder to reach buyers and renters worldwide.
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-brand-100">
                  <CheckCircle className="w-5 h-5 text-brand-300 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <Link href="/auth/register?role=AGENT" className="btn-primary bg-white text-brand-700 hover:bg-brand-50">
                Start free trial
              </Link>
              <Link href="/pricing" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                View pricing
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">14</div>
                <div className="text-brand-200">day free trial</div>
                <div className="mt-6 space-y-3 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-200">Active listings</span>
                    <span className="text-white font-medium">Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-200">Lead management</span>
                    <span className="text-white font-medium">Included</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-200">Analytics</span>
                    <span className="text-white font-medium">Advanced</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-200">AI tools</span>
                    <span className="text-white font-medium">Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block mb-4 px-3 py-1 bg-pink-500/20 text-pink-300 text-xs font-semibold rounded-full border border-pink-500/30">
              For Agents &amp; Agencies
            </span>
            <h2 className="text-3xl font-bold mb-4">Grow your real estate business globally</h2>
            <p className="text-purple-200 mb-8 leading-relaxed">
              Join thousands of agents and agencies using WorldPropertyFinder to reach buyers and renters worldwide.
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-purple-100">
                  <CheckCircle className="w-5 h-5 text-pink-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <Link href="/auth/register?role=AGENT" className="inline-flex items-center justify-center px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors">
                Start free trial
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center px-5 py-2.5 border border-white/30 text-white hover:bg-white/10 font-medium rounded-lg transition-colors">
                View pricing
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-pink-300/20">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">14</div>
                <div className="text-pink-300">day free trial</div>
                <div className="mt-6 space-y-3 text-left">
                  {[['Active listings', 'Unlimited'], ['Lead management', 'Included'], ['Analytics', 'Advanced'], ['AI tools', 'Included']].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-purple-300">{k}</span>
                      <span className="text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

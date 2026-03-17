import { Search, Heart, MessageCircle, Key } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Search globally', description: 'Use our powerful search to find properties across 150+ countries with advanced filters.' },
  { icon: Heart, title: 'Save favorites', description: 'Save properties you love and set up alerts for new listings matching your criteria.' },
  { icon: MessageCircle, title: 'Contact agents', description: 'Reach out directly to verified agents and owners. Schedule viewings in one click.' },
  { icon: Key, title: 'Move in', description: 'Complete your transaction with confidence using our trusted network of professionals.' },
];

export function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="section-title">How it works</h2>
        <p className="text-gray-500 mt-2">Find your dream property in four simple steps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="relative inline-flex">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-brand-600" />
              </div>
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

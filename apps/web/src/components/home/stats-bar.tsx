const stats = [
  { value: '2M+', label: 'Properties listed' },
  { value: '150+', label: 'Countries covered' },
  { value: '500K+', label: 'Monthly searches' },
  { value: '40+', label: 'Languages supported' },
];

export function StatsBar() {
  return (
    <div className="bg-brand-700 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-brand-200">{stat.value}</div>
              <div className="text-sm text-brand-300 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

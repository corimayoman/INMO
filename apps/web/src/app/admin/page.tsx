'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Home, MessageCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const stats = [
    { icon: Users, label: 'Total users', value: data?.totalUsers || 0, color: 'text-blue-600 bg-blue-50' },
    { icon: Home, label: 'Active listings', value: data?.activeListings || 0, color: 'text-green-600 bg-green-50' },
    { icon: AlertCircle, label: 'Pending review', value: data?.pendingReview || 0, color: 'text-yellow-600 bg-yellow-50' },
    { icon: MessageCircle, label: 'Total inquiries', value: data?.totalInquiries || 0, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent listings */}
        <div className="card">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent listings</h2>
            <span className="badge-blue">Pending review: {data?.pendingReview}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recentListings?.slice(0, 8).map((listing: any) => (
              <div key={listing.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{listing.title}</div>
                  <div className="text-xs text-gray-500">{listing.location?.city} • {formatDate(listing.createdAt)}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`badge text-xs ${listing.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : listing.status === 'PENDING_REVIEW' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {listing.status}
                  </span>
                  {listing.status === 'PENDING_REVIEW' && (
                    <button className="text-xs text-brand-600 hover:underline">Review</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="card">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent users</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recentUsers?.map((user: any) => (
              <div key={user.id} className="p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-medium shrink-0">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <span className="ml-auto badge bg-gray-100 text-gray-600 text-xs shrink-0">{user.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

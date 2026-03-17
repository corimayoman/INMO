'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, Calendar } from 'lucide-react';
import { inquiriesApi } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ContactFormProps {
  listing: any;
}

export function ContactForm({ listing }: ContactFormProps) {
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState<'contact' | 'viewing'>('contact');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
      email: user?.email || '',
      phone: '',
      message: `Hi, I'm interested in this property. Could you please provide more information?`,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await inquiriesApi.create({ ...data, listingId: listing.id });
      setSubmitted(true);
      toast.success('Your inquiry has been sent!');
    } catch {
      toast.error('Failed to send inquiry. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="card p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Mail className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">Inquiry sent!</h3>
        <p className="text-sm text-gray-500">The agent will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="text-2xl font-bold text-brand-700 mb-1">{formatPrice(listing.price, listing.currency)}</div>
      {listing.listingType === 'RENT' && <div className="text-sm text-gray-500 mb-4">per month</div>}

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button onClick={() => setTab('contact')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'contact' ? 'bg-white shadow-sm text-brand-700' : 'text-gray-600'}`}>
          Contact
        </button>
        <button onClick={() => setTab('viewing')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'viewing' ? 'bg-white shadow-sm text-brand-700' : 'text-gray-600'}`}>
          Book viewing
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register('name', { required: true })} placeholder="Your name" className="input" />
        <input {...register('email', { required: true })} type="email" placeholder="Email address" className="input" />
        <input {...register('phone')} type="tel" placeholder="Phone (optional)" className="input" />
        {tab === 'viewing' && (
          <input {...register('scheduledAt')} type="datetime-local" className="input" />
        )}
        <textarea {...register('message', { required: true })} rows={3} placeholder="Your message..." className="input resize-none" />
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
          {isSubmitting ? 'Sending...' : tab === 'viewing' ? 'Request viewing' : 'Send inquiry'}
        </button>
      </form>

      <div className="mt-4 flex gap-3 text-sm text-gray-500">
        <a href={`tel:${listing.agent?.user?.phone}`} className="flex items-center gap-1 hover:text-brand-600">
          <Phone className="w-3.5 h-3.5" />Call
        </a>
        <a href={`mailto:${listing.agent?.user?.email}`} className="flex items-center gap-1 hover:text-brand-600">
          <Mail className="w-3.5 h-3.5" />Email
        </a>
      </div>
    </div>
  );
}

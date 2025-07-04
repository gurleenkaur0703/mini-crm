'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { fetchFromApi } from '@/utils/api';

export default function AddCustomerForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchFromApi('/api/customers', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success('Customer added!');
      router.push('/customers');
    } catch (error) {
      console.error('Failed to add customer:', error);
      toast.error('Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md sm:max-w-xl mx-auto mt-6 sm:mt-10 px-3 sm:px-6 py-6 bg-white shadow rounded">
      <Toaster position="top-right" />
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">Add New Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          required
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          required
          className="w-full border p-2 rounded"
          value={form.phone}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={submitting}
          className={`w-full sm:w-auto px-4 py-2 rounded text-white ${
            submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Adding...' : 'Add Customer'}
        </button>
      </form>
    </div>
  );
}

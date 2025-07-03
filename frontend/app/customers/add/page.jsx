'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AddCustomerForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/customers', form);
      toast.success('Customer added!');
      router.push('/customers');
    } catch (err) {
      toast.error('Failed to add customer');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ...existing code...
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md sm:max-w-xl mx-auto mt-6 sm:mt-10 px-3 sm:px-6 py-6 bg-white shadow rounded">
      <h2 className="text-xl sm:text-2xl font-semibold">Add New Customer</h2>

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
        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Adding...' : 'Add Customer'}
      </button>
    </form>
  );
// ...existing code...
}

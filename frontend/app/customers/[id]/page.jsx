'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { fetchFromApi } from '@/utils/api';

export default function EditCustomerPage() {
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!params?.id) return;

    const fetchCustomer = async () => {
      try {
        const customer = await fetchFromApi(`/api/customers/${params.id}`);
        setForm({
          ...customer,
          lastActive: formatDate(customer.lastActive),
          totalSpend: customer.totalSpend ?? 0,
          visits: customer.visits ?? 0,
        });
      } catch (error) {
        console.error('Failed to load customer:', error);
        toast.error('Failed to load customer data');
      }
    };

    fetchCustomer();
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'totalSpend' || name === 'visits' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchFromApi(`/api/customers/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      toast.success('Customer updated successfully!');
      router.push('/customers');
    } catch (error) {
      console.error('Failed to update customer:', error);
      toast.error('Failed to update customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-6 sm:mt-10 px-3 sm:px-6 py-6 bg-white shadow rounded">
      <Toaster position="top-right" />
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Edit Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'totalSpend', 'visits', 'lastActive'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize mb-1">{field}</label>
            <input
              type={
                field === 'lastActive'
                  ? 'date'
                  : field === 'totalSpend' || field === 'visits'
                  ? 'number'
                  : 'text'
              }
              name={field}
              value={form[field] ?? ''}
              onChange={handleChange}
              required={field !== 'totalSpend' && field !== 'visits'}
              className="w-full p-2 border rounded"
              min={field === 'totalSpend' || field === 'visits' ? 0 : undefined}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full sm:w-auto px-4 py-2 rounded text-white ${
            submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

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

    axios.get(`http://localhost:5000/api/customers/${params.id}`).then((res) => {
      const customer = res.data;
      setForm({
        ...customer,
        lastActive: formatDate(customer.lastActive),
        totalSpend: customer.totalSpend ?? 0,
        visits: customer.visits ?? 0,
      });
    });
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'totalSpend' || name === 'visits') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`http://localhost:5000/api/customers/${params.id}`, form);
      router.push('/customers');
    } catch (error) {
      console.error('Failed to update customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!form) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'totalSpend', 'visits', 'lastActive'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">{field}</label>
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
          className={`px-4 py-2 rounded text-white ${submitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchFromApi } from '@/utils/api';

export default function AddOrderPage() {
  const [form, setForm] = useState({
    customerId: '',
    orderAmount: '',
    orderDate: '',
    status: 'Pending',
  });

  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getCustomers() {
      try {
        const data = await fetchFromApi('/api/customers');
        setCustomers(data);
      } catch (err) {
        toast.error('Failed to fetch customers');
        console.error(err);
      }
    }
    getCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchFromApi('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      toast.success('Order added!');
      router.push('/orders');
    } catch (err) {
      toast.error('Failed to add order');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md sm:max-w-xl mx-auto mt-6 sm:mt-10 px-3 sm:px-6 py-6 bg-white dark:bg-gray-800 shadow rounded text-gray-900 dark:text-gray-100">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Add New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a customer</option>
            {customers.map((cust) => (
              <option key={cust._id} value={cust._id}>
                {cust.name} ({cust.email})
              </option>
            ))}
          </select>
        </div>

        <input
          type="number"
          name="orderAmount"
          placeholder="Order Amount"
          value={form.orderAmount}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />

        <input
          type="date"
          name="orderDate"
          value={form.orderDate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Order
        </button>
      </form>
    </div>
  );
}

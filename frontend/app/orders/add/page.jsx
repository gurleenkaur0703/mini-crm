'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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
    axios.get('http://localhost:5000/api/customers').then((res) => {
      setCustomers(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', form);
      toast.success('Order added!');
      router.push('/orders');
    } catch (err) {
      toast.error('Failed to add order');
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Add New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          name="orderDate"
          value={form.orderDate}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Order
        </button>
      </form>
    </div>
  );
}

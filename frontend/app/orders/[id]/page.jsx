'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditOrderPage({ params }) {
  const [form, setForm] = useState(null);
  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [orderRes, customersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/orders/${params.id}`),
        axios.get('http://localhost:5000/api/customers'),
      ]);
      setForm({
        customerId: orderRes.data.customerId._id,
        orderAmount: orderRes.data.orderAmount,
        orderDate: orderRes.data.orderDate.split('T')[0],
        status: orderRes.data.status,
      });
      setCustomers(customersRes.data);
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/orders/${params.id}`, form);
      toast.success('Order updated!');
      router.push('/orders');
    } catch (err) {
      toast.error('Failed to update order');
      console.error(err);
    }
  };

  if (!form) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-lg sm:max-w-2xl mx-auto mt-6 sm:mt-10 px-3 sm:px-6 py-6 bg-white shadow rounded">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Edit Order</h2>
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
          className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );

}

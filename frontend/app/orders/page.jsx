// app/orders/page.jsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        setOrders(orders.filter((o) => o._id !== id));
        toast.success('Order deleted');
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  if (status === 'loading') return <p className="p-4">Loading...</p>;
  if (status === 'unauthenticated') return <p className="p-4">Login to access the CRM</p>;

  const filtered = orders.filter((order) =>
    [order.customerId?.name, order.status].some((field) =>
      (field || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/orders/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Order
          </button>
          <input
            type="text"
            placeholder="Search by customer or status..."
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount (₹)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-4 py-2 text-gray-500">{order._id}</td>
                    <td className="px-4 py-2">{order.customerId?.name || 'N/A'}</td>
                    <td className="px-4 py-2">₹{order.orderAmount}</td>
                    <td className="px-4 py-2">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => router.push(`/orders/edit/${order._id}`)}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center mt-4 gap-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              ⬅️ Prev
            </button>

            <p className="text-sm text-gray-700 min-w-[120px] text-center">
              Page {currentPage} of {totalPages}
            </p>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { fetchFromApi } from '@/utils/api';

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
      const data = await fetchFromApi('/api/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await fetchFromApi(`/api/orders/${id}`, { method: 'DELETE' });
        setOrders((prev) => prev.filter((o) => o._id !== id));
        toast.success('Order deleted');
      } catch (err) {
        toast.error('Delete failed');
        console.error(err);
      }
    }
  };

  if (status === 'loading') return <p className="p-4 text-gray-800 dark:text-gray-200">Loading...</p>;
  if (status === 'unauthenticated')
    return <p className="p-4 text-gray-800 dark:text-gray-200">Login to access the CRM</p>;

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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => router.push('/orders/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            ➕ Add Order
          </button>
          <input
            type="text"
            placeholder="Search by customer or status..."
            className="border p-2 rounded w-full sm:w-64 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-800 dark:text-gray-200">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
            <table className="min-w-[600px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm sm:text-base">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Amount (₹)</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {paginatedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <td className="px-4 py-2">{order._id}</td>
                    <td className="px-4 py-2">{order.customerId?.name || 'N/A'}</td>
                    <td className="px-4 py-2">₹{order.orderAmount}</td>
                    <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 capitalize">{order.status}</td>
                    <td className="px-4 py-2 text-center">
                      {/* <button
                        onClick={() => router.push(`/orders/edit/${order._id}`)}
                        className="text-blue-600 hover:underline mr-2"
                      >
                        Edit
                      </button> */}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2 sm:gap-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 w-full sm:w-auto"
            >
              ⬅️ Prev
            </button>

            <p className="text-sm text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
              Page {currentPage} of {totalPages}
            </p>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 w-full sm:w-auto"
            >
              Next ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
}

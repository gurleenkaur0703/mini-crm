'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Papa from 'papaparse';
import toast, { Toaster } from 'react-hot-toast';
import { fetchFromApi } from '@/utils/api';

export default function CustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  const itemsPerPage = 10;

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // Google login
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCustomers();
    }
  }, [status]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchFromApi('/api/customers');
      setCustomers(data);
    } catch (err) {
      console.error('Failed to load customers:', err);
      setError('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        await fetchFromApi(`/api/customers/${id}`, { method: 'DELETE' });
        setCustomers((prev) => prev.filter((c) => c._id !== id));
        toast.success('Customer deleted successfully');
      } catch (err) {
        toast.error('Failed to delete customer');
        console.error(err);
      }
    }
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        const requiredFields = ['name', 'email', 'phone', 'visits', 'lastActive'];

        const isValid = rows.every(row =>
          requiredFields.every(field => row[field])
        );

        if (!isValid) {
          setError('CSV format invalid. Required: name, email, phone, visits, lastActive');
          setUploading(false);
          return;
        }

        try {
          await fetchFromApi('/api/customers/bulk', {
            method: 'POST',
            body: JSON.stringify({ customers: rows }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          toast.success('Customers uploaded!');
          fetchCustomers();
        } catch (err) {
          toast.error('Upload failed');
          console.error(err);
        } finally {
          setUploading(false);
        }
      },
    });
  };

  const filtered = customers.filter((cust) =>
    [cust.name, cust.email, cust.phone].some(field =>
      (field || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCustomers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (status === 'loading' || loading)
    return <p className="p-4 text-gray-700 dark:text-gray-300">Loading...</p>;
  if (!session) return null;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Customer Directory
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => router.push('/customers/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            ➕ Add New Customer
          </button>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="border p-2 rounded w-full sm:w-64 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center flex-wrap">
        <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto text-center">
          Upload CSV
          <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
        </label>
        <a
          href="/sample.csv"
          download
          className="text-blue-600 hover:underline text-sm w-full sm:w-auto text-center dark:text-blue-400"
        >
          Download Sample CSV
        </a>
        {uploading && <span className="text-sm text-gray-500 dark:text-gray-400">Uploading...</span>}
        {error && <span className="text-sm text-red-600 dark:text-red-400">{error}</span>}
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-lg">
        <table className="min-w-[700px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm sm:text-base text-gray-900 dark:text-gray-100">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Customer ID</th>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Visits</th>
              <th className="px-4 py-3 text-left font-medium">Total Spend</th>
              <th className="px-4 py-3 text-left font-medium">Last Active</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {paginatedCustomers.map((cust) => (
              <tr key={cust._id}>
                <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{cust._id}</td>
                <td className="px-4 py-2">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.phone}</td>
                <td className="px-4 py-2">{cust.visits}</td>
                <td className="px-4 py-2">${cust.totalSpend?.toFixed(2) ?? '0.00'}</td>
                <td className="px-4 py-2">
                  {cust.lastActive ? new Date(cust.lastActive).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => router.push(`/customers/${cust._id}`)}
                    className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cust._id)}
                    className="text-red-600 hover:underline dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2 sm:gap-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
        >
          ⬅️ Prev
        </button>

        <p className="text-sm text-gray-700 dark:text-gray-300 min-w-[120px] text-center">
          Page {currentPage} of {totalPages}
        </p>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
}

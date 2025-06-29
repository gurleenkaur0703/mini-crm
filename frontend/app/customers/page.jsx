'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import Papa from 'papaparse';
import toast, { Toaster } from 'react-hot-toast';

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

  // Redirect to Google login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // Google login
    }
  }, [status]);

  // Fetch customers after authentication
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCustomers();
    }
  }, [status]);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
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
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        setCustomers(customers.filter((c) => c._id !== id));
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
          await axios.post('http://localhost:5000/api/customers/bulk', { customers: rows });
          toast.success('Customers uploaded!');
          fetchCustomers();
        } catch (err) {
          toast.error('Upload failed');
        } finally {
          setUploading(false);
        }
      }
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

  if (status === 'loading' || loading) return <p className="p-4">Loading...</p>;
  if (!session) return null;

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Customer Directory</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/customers/add')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add New Customer
          </button>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="border p-2 rounded w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Upload Section */}
      <div className="flex gap-4 items-center flex-wrap">
        <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Upload CSV
          <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" />
        </label>
        <a
          href="/sample.csv"
          download
          className="text-blue-600 hover:underline text-sm"
        >
          Download Sample CSV
        </a>
        {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Visits</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total Spend</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Last Active</th>
              <th className="px-4 py-3 text-sm font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedCustomers.map((cust) => (
              <tr key={cust._id}>
                <td className="px-4 py-2 text-gray-500">{cust._id}</td>
                <td className="px-4 py-2">{cust.name}</td>
                <td className="px-4 py-2">{cust.email}</td>
                <td className="px-4 py-2">{cust.phone}</td>
                <td className="px-4 py-2">{cust.visits}</td>
                <td className="px-4 py-2">${cust.totalSpend?.toFixed(2) ?? '0.00'}</td>
                <td className="px-4 py-2">{new Date(cust.lastActive).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => router.push(`/customers/${cust._id}`)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cust._id)}
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

      {/* Pagination */}
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
    </div>
  );
}

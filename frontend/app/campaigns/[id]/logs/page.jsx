'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { fetchFromApi } from '@/utils/api';

export default function CampaignLogsPage({ params }) {
  const { id } = params; // correctly destructure params
  const router = useRouter();
  const { status } = useSession();

  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && id) {
      fetchLogs();
    }
  }, [status, id]);

  const fetchLogs = async () => {
    try {
      const data = await fetchFromApi(`/api/campaigns/${id}/logs`);
      setLogs(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = () => {
    if (filter === 'all') return logs;
    return logs.filter(log => log.status === filter);
  };

  const exportCSV = () => {
    const rows = [['Customer Name', 'Email', 'Message', 'Status', 'Timestamp']];
    const filtered = filteredLogs();

    filtered.forEach(log => {
      rows.push([
        log.customerId?.name || '',
        log.customerId?.email || '',
        log.message,
        log.status,
        new Date(log.timestamp).toLocaleString(),
      ]);
    });

    const csvContent = rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = `campaign_logs_${id}.csv`;
    link.click();
  };

  if (loading) return <p className="p-6">Loading logs...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Campaign Logs</h1>
        <button
          onClick={() => router.push(`/campaigns/${id}`)}
          className="text-blue-600 hover:underline"
        >
          ← Back to Campaign
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="sent">Sent</option>
          <option value="failed">Failed</option>
        </select>

        <button
          onClick={exportCSV}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Message</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredLogs().map((log, i) => (
              <tr key={i}>
                <td className="px-4 py-2">{log.customerId?.name}</td>
                <td className="px-4 py-2">{log.customerId?.email}</td>
                <td className="px-4 py-2 text-sm">{log.message}</td>
                <td
                  className={`px-4 py-2 capitalize ${
                    log.status === 'failed' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {log.status}
                </td>
                <td className="px-4 py-2 text-sm">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredLogs().length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

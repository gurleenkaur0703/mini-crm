'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { fetchFromApi } from '@/utils/api';

export default function CampaignsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchCampaigns();
    }
  }, [status]);

  const fetchCampaigns = async () => {
    try {
      const data = await fetchFromApi('/api/campaigns');
      setCampaigns(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (id) => {
    if (!confirm('Send this campaign now?')) return;

    setSendingId(id);
    try {
      const data = await fetchFromApi(`/api/campaigns/${id}/send`, {
        method: 'POST',
      });
      toast.success(`Sent to ${data.count} customers`);
      fetchCampaigns();
    } catch (err) {
      console.error(err);
      toast.error('Failed to send campaign');
    } finally {
      setSendingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await fetchFromApi(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });
      toast.success('Campaign deleted');
      setCampaigns((prev) => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 text-gray-800 dark:text-gray-100">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Campaigns</h1>
        <button
          onClick={() => router.push('/campaigns/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          ➕ New Campaign
        </button>
      </div>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow rounded-lg">
          <table className="min-w-[700px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm sm:text-base">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Segment</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Sent At</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {campaigns.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-2 font-semibold">{c.name}</td>
                  <td className="px-4 py-2">{c.segmentId?.name || 'N/A'}</td>
                  <td className="px-4 py-2 capitalize">{c.status}</td>
                  <td className="px-4 py-2">
                    {c.sentAt ? new Date(c.sentAt).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => router.push(`/campaigns/${c._id}`)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleSend(c._id)}
                      disabled={c.status === 'sent' || sendingId === c._id}
                      className={`text-sm ${
                        c.status === 'sent' || sendingId === c._id
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-green-600 dark:text-green-400 hover:underline'
                      }`}
                    >
                      {sendingId === c._id ? 'Sending...' : 'Send'}
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center px-4 py-6 text-gray-500 dark:text-gray-400">
                    No campaigns created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

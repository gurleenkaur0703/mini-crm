//frontend/app/campaigns/page.jsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

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
      const res = await axios.get('http://localhost:5000/api/campaigns');
      setCampaigns(res.data);
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
      const res = await axios.post(`http://localhost:5000/api/campaigns/${id}/send`);
      toast.success(`Sent to ${res.data.count} customers`);
      fetchCampaigns(); // refresh list
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
      await axios.delete(`http://localhost:5000/api/campaigns/${id}`);
      toast.success('Campaign deleted');
      setCampaigns(campaigns.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  // ...existing code...
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
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
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-[700px] w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Segment</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Sent At</th>
                <th className="px-4 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
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
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleSend(c._id)}
                      disabled={c.status === 'sent' || sendingId === c._id}
                      className={`text-sm ${
                        c.status === 'sent'
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-green-600 hover:underline'
                      }`}
                    >
                      {sendingId === c._id ? 'Sending...' : 'Send'}
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center px-4 py-6 text-gray-500">
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
// ...existing code...
}

'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function CampaignDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { status } = useSession();

  const [campaign, setCampaign] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && id) {
      fetchCampaign();
      fetchLogs();
    }
  }, [status, id]);

  const fetchCampaign = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
      setCampaign(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Campaign not found, probably deleted');
      } else {
        toast.error('Failed to load campaign');
        console.error(err);
      }
      setCampaign(null); // prevents endless loading
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/campaigns/${id}/logs`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!confirm('Send this campaign now?')) return;
    setSending(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/campaigns/${id}/send`);
      toast.success(`Sent to ${res.data.count} customers`);
      fetchCampaign();
      fetchLogs();
    } catch (err) {
      toast.error('Sending failed');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const sentCount = logs.filter(log => log.status === 'sent').length;
  const failedCount = logs.filter(log => log.status === 'failed').length;

  if (loading) return <p className="p-4">Loading...</p>;
  if (!campaign) return <p className="p-4">No campaign found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold text-gray-800">Campaign Details</h1>
      <div className="bg-white shadow rounded p-4 space-y-2">
        <p><strong>Name:</strong> {campaign.name}</p>
        <p><strong>Message:</strong> {campaign.message}</p>
        <p><strong>Segment:</strong> {campaign.segmentId?.name || 'N/A'}</p>
        <p><strong>Status:</strong> {campaign.status}</p>
        {campaign.sentAt && <p><strong>Sent At:</strong> {new Date(campaign.sentAt).toLocaleString()}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSend}
          disabled={campaign.status === 'sent' || sending}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {sending ? 'Sending...' : campaign.status === 'sent' ? 'Already Sent' : 'Send Campaign'}
        </button>
        <button onClick={() => router.push(`/campaigns/${id}/logs`)} className="text-sm text-blue-600 underline hover:text-blue-800">
          View Delivery Logs →
        </button>
      </div>

      <div className="bg-gray-100 rounded p-4">
        <h3 className="text-lg font-semibold mb-2">📊 Delivery Summary</h3>
        <p><strong>Audience Size:</strong> {logs.length}</p>
        <p><strong>Sent:</strong> {sentCount}</p>
        <p><strong>Failed:</strong> {failedCount}</p>
      </div>
    </div>
  );
}

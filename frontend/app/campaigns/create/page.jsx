'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { fetchFromApi } from '../../utils/api'; // Adjust path if needed

export default function CreateCampaignPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated') {
      fetchSegments();
    }
  }, [status]);

  const fetchSegments = async () => {
    try {
      const data = await fetchFromApi('/api/segments');
      setSegments(data);
    } catch (err) {
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !message || !segmentId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const data = await fetchFromApi('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({ name, message, segmentId }),
      });
      toast.success('Campaign created!');
      router.push(`/campaigns/${data._id}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create campaign');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-3 sm:p-6 bg-white rounded shadow space-y-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl sm:text-3xl font-bold">Create Campaign</h1>

      {loading ? (
        <p>Loading segments...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter message to send"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Select Segment</label>
            <select
              value={segmentId}
              onChange={(e) => setSegmentId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Segment --</option>
              {segments.map((seg) => (
                <option key={seg._id} value={seg._id}>
                  {seg.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Campaign
          </button>
        </form>
      )}
    </div>
  );
}

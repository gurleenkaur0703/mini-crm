'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function SegmentsPage() {
  const { data: session, status } = useSession();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');  // redirect if not logged in
    } else if (status === 'authenticated') {
      fetchSegments();
    }
  }, [status]);

  const fetchSegments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/segments');
      setSegments(res.data);
    } catch (err) {
      console.error('Failed to load segments:', err);
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this segment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/segments/${id}`);
        setSegments(segments.filter((s) => s._id !== id));
        toast.success('Segment deleted');
      } catch (err) {
        console.error(err);
        toast.error('Delete failed');
      }
    }
  };

  if (status === 'loading') return <p className="p-6">Loading...</p>;
  if (status === 'unauthenticated') return <p className="p-6">Redirecting to login...</p>;

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audience Segments</h1>
        <button
          onClick={() => router.push('/segments/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create Segment
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Rules</th>
                <th className="px-4 py-3 text-sm font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {segments.map((segment) => (
                <tr key={segment._id}>
                  <td className="px-4 py-2 font-semibold">{segment.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {segment.rules?.map((rule, i) => (
                      <span key={i} className="block">
                        {rule.field} {rule.operator} {rule.value}{' '}
                        {rule.logic && i !== segment.rules.length - 1 ? rule.logic : ''}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => router.push(`/segments/${segment._id}`)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(segment._id)}
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
      )}
    </div>
  );
}

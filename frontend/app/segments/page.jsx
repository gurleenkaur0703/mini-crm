'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { fetchFromApi } from '../../utils/api';

export default function SegmentsPage() {
  const { data: session, status } = useSession();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      console.error('Failed to load segments:', err);
      toast.error('Failed to load segments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this segment?')) {
      try {
        await fetchFromApi(`/api/segments/${id}`, { method: 'DELETE' });
        setSegments((prev) => prev.filter((s) => s._id !== id));
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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Audience Segments</h1>
        <button
          onClick={() => router.push('/segments/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          ➕ Create Segment
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-[600px] w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Rules</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {segments.map((segment) => (
                <tr key={segment._id}>
                  <td className="px-4 py-2 font-semibold">{segment.name}</td>
                  <td className="px-4 py-2 text-gray-600">
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

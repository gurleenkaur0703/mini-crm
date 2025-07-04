'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { fetchFromApi } from '@/utils/api';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [customers, setCustomers] = useState(0);
  const [segments, setSegments] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // Redirect to login
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const [custData, segData, campData, orderData] = await Promise.all([
        fetchFromApi('/api/customers'),
        fetchFromApi('/api/segments'),
        fetchFromApi('/api/campaigns'),
        fetchFromApi('/api/orders'),
      ]);

      setCustomers(custData.length);
      setSegments(segData.length);
      setCampaigns(campData);
      setOrders(orderData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) =>
    status === 'sent' ? 'text-green-600' : 'text-yellow-500';

  const recentCampaigns = campaigns
    .filter(camp => camp && camp._id && camp.status)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const chartData = [
    { name: 'Customers', count: customers },
    { name: 'Orders', count: orders.length },
    { name: 'Segments', count: segments },
    { name: 'Campaigns', count: campaigns.length },
  ];

  if (status === 'loading' || loading) return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📊 Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { title: 'Total Customers', value: customers },
          { title: 'Total Orders', value: orders.length },
          { title: 'Total Segments', value: segments },
          { title: 'Total Campaigns', value: campaigns.length },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white hover:shadow-lg transition rounded-xl p-4 sm:p-6 border border-gray-200 flex flex-col items-start"
          >
            <h2 className="text-xs sm:text-sm text-gray-500">{card.title}</h2>
            <p className="text-2xl sm:text-4xl font-bold text-blue-600">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">📈 Data Overview</h2>
        <div className="overflow-x-auto">
          <div className="w-full h-48 sm:h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  interval={0} 
                  angle={-20} 
                  textAnchor="end"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white shadow rounded-xl p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">🕒 Recent Campaigns</h2>
        {recentCampaigns.length === 0 ? (
          <p className="text-gray-600">No campaigns yet.</p>
        ) : (
          <ul className="space-y-3 sm:space-y-4">
            {recentCampaigns.map((camp) => (
              <li key={camp._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="text-md font-semibold text-gray-800">{camp.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    <span className={statusColor(camp.status)}>
                      ● {(camp.status ? camp.status.toUpperCase() : 'DRAFT')}
                    </span>{' '}
                    •{' '}
                    {camp.sentAt ? new Date(camp.sentAt).toLocaleString() : 'Not Sent'}
                  </p>
                </div>
                <Link
                  href={`/campaigns/${camp._id}`}
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                >
                  View →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

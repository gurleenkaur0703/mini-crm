//frontend/app/segments/[id]/page.jsx
'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const fields = ['visits', 'totalSpend', 'lastActive'];
const operators = ['>', '>=', '<', '<=', '==', '!='];
const logicOptions = ['AND', 'OR'];

export default function EditSegmentPage({ params }) {
  const { id } = use(params); // ✅ unwrap params safely

  const [name, setName] = useState('');
  const [rules, setRules] = useState([]);
  const [logic, setLogic] = useState('AND');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/segments/${id}`)
      .then((res) => {
        setName(res.data.name);
        setRules(res.data.rules || []);
        setLogic(res.data.logic || 'AND');
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch segment', err);
        toast.error('Failed to load segment');
      });
  }, [id]);

  const updateRule = (index, key, value) => {
    const updated = [...rules];
    updated[index][key] = value;
    setRules(updated);
  };

  const addRule = () => {
    setRules([...rules, { field: 'visits', operator: '>', value: '' }]);
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/segments/${id}`, {
        name,
        rules,
        logic,
      });
      toast.success('Segment updated');
      router.push('/segments');
    } catch (err) {
      console.error('Update failed', err);
      toast.error('Failed to update segment');
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Segment</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Segment Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Logic Between Rules</label>
          <select
            value={logic}
            onChange={(e) => setLogic(e.target.value)}
            className="border p-2 rounded mb-4"
          >
            {logicOptions.map((lg) => (
              <option key={lg} value={lg}>{lg}</option>
            ))}
          </select>

          <label className="block mb-2 font-medium">Rules</label>
          <div className="space-y-4">
            {rules.map((rule, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(i, 'field', e.target.value)}
                  className="border p-2 rounded"
                >
                  {fields.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <select
                  value={rule.operator}
                  onChange={(e) => updateRule(i, 'operator', e.target.value)}
                  className="border p-2 rounded"
                >
                  {operators.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(i, 'value', e.target.value)}
                  placeholder="Value"
                  className="border p-2 rounded w-32"
                />
                <button
                  type="button"
                  onClick={() => removeRule(i)}
                  className="text-red-500 hover:underline text-sm"
                >
                  ✖ Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRule}
              className="text-blue-600 hover:underline text-sm"
            >
              ➕ Add Rule
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Segment
        </button>
      </form>
    </div>
  );
}

//frontend/app/segments/create/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const fields = ['visits', 'totalSpend', 'lastActive'];
const operators = ['>', '>=', '<', '<=', '==', '!='];
const logicOptions = ['AND', 'OR'];

export default function CreateSegmentPage() {
  const [name, setName] = useState('');
  const [rules, setRules] = useState([{ field: 'visits', operator: '>', value: '' }]);
  const [logic, setLogic] = useState('AND');
  const router = useRouter();

  const addRule = () => {
    setRules([...rules, { field: 'visits', operator: '>', value: '' }]);
  };

  const updateRule = (index, key, value) => {
    const newRules = [...rules];
    newRules[index][key] = value;
    setRules(newRules);
  };

  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/segments', { name, rules, logic });
      toast.success('Segment created');
      router.push('/segments');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create segment');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Audience Segment</h1>
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
                {rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(i)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    ✖ Remove
                  </button>
                )}
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Segment
        </button>
      </form>
    </div>
  );
}

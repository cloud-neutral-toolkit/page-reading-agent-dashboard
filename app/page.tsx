'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: 'https://www.onwalk.net',
    mode: 'slow',
    region: 'JP',
    device: 'mobile'
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const runAgent = async () => {
    setLoading(true);
    setStatus({ type: null, message: '' });
    try {
      const res = await fetch('/api/run-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setStatus({
          type: 'success',
          message: `✅ Success! Duration: ${data.duration}s | Device: ${data.device} | Region: ${data.region}`
        });
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to dispatch agent.' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Network error occurred.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            CyberFlâneur
          </h1>
          <p className="text-slate-400 text-sm mt-2">Remote Agent Control</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Target URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder-slate-600"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Region</label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="JP">Tokyo (Asia)</option>
                <option value="US">US Central</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mode</label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none"
              >
                <option value="quick">Quick Scan</option>
                <option value="slow">Slow Read</option>
                <option value="deep">Deep Dive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Device Persona</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormData({ ...formData, device: 'mobile' })}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${formData.device === 'mobile' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
              >
                Mobile
              </button>
              <button
                onClick={() => setFormData({ ...formData, device: 'desktop' })}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${formData.device === 'desktop' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
              >
                Desktop
              </button>
            </div>
          </div>

          <button
            onClick={runAgent}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Dispatch Agent'
            )}
          </button>

          {status.message && (
            <div className={`p-3 rounded-lg text-sm text-center ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState, useCallback } from 'react';

const STATUS_COLORS = {
  NEW: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
  REVIEWED: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  ACTIONED: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
};

const RATING_FIELDS = [
  { key: 'overallExperience', label: 'Overall Experience' },
  { key: 'VehicleCondition', label: 'Vehicle Condition' },
  { key: 'ChauffeurProfessionalism', label: 'Chauffeur Professionalism' },
  { key: 'BodyguardProfessionalism', label: 'Bodyguard Professionalism' },
  { key: 'SafetyAndSecurity', label: 'Safety & Security' },
  { key: 'CoordinationAndCommunication', label: 'Coordination & Communication' },
];

function StarRating({ value }) {
  if (value == null) return <span className="text-zinc-600 text-sm font-mono">—</span>;
  return (
    <span className="flex gap-0.5 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= value ? 'text-amber-400' : 'text-zinc-700'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-zinc-500 font-mono">{value}/5</span>
    </span>
  );
}

function FeedbackDetailModal({ feedback, onClose, onStatusChange, adminKey }) {
  const [status, setStatus] = useState(feedback.status);
  const [saving, setSaving] = useState(false);


  async function handleStatusChange(newStatus) {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ id: feedback.id, status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        onStatusChange(feedback.id, newStatus);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">Feedback Details</h2>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">ID #{feedback.id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Client Name', value: feedback.clientName },
              { label: 'Phone', value: feedback.clientPhone },
              { label: 'Assignment ID', value: feedback.assignmentId, mono: true },
              { label: 'Service Date', value: new Date(feedback.servicedate).toLocaleDateString() },
              ...(feedback.salesPersonName ? [{ label: 'Sales Person', value: feedback.salesPersonName }] : []),
            ].map(({ label, value, mono }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                <p className="text-[0.7rem] font-medium text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-sm text-zinc-100 ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</p>
              </div>
            ))}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <p className="text-[0.7rem] font-medium text-zinc-500 uppercase tracking-widest mb-2">Services</p>
              <div className="flex gap-2">
                {feedback.hasCar && <span className="text-xs bg-zinc-700 text-zinc-200 px-2.5 py-0.5 rounded-full border border-zinc-600">Car</span>}
                {feedback.hasBodyguard && <span className="text-xs bg-zinc-700 text-zinc-200 px-2.5 py-0.5 rounded-full border border-zinc-600">Bodyguard</span>}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-[0.7rem] font-medium text-zinc-500 uppercase tracking-widest">Ratings</p>
            </div>
            <div className="divide-y divide-zinc-800">
              {RATING_FIELDS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-zinc-400">{label}</span>
                  <StarRating value={feedback[key]} />
                </div>
              ))}
            </div>
          </div>

          {feedback.comments && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-[0.7rem] font-medium text-zinc-500 uppercase tracking-widest mb-2">Comments</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{feedback.comments}</p>
            </div>
          )}

          <div>
            <p className="text-[0.7rem] font-medium text-zinc-500 uppercase tracking-widest mb-3">Update Status</p>
            <div className="flex gap-2">
              {['NEW', 'REVIEWED', 'ACTIONED'].map((s) => (
                <button
                  key={s}
                  disabled={saving}
                  onClick={() => handleStatusChange(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all disabled:opacity-50 border ${
                    status === s ? STATUS_COLORS[s] : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[0.72rem] text-zinc-600 font-mono">
            Submitted: {new Date(feedback.submissionDate).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function GenerateLinkModal({ onClose, adminKey }) {
  const [form, setForm] = useState({
    assignmentId: '',
    clientName: '',
    clientPhone: '',
    hasBodyguard: false,
    hasCar: false,
    salesPersonName: '',
    servicedate: '',
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setGeneratedUrl('');
    setLoading(true);
    try {
      const res = await fetch('/api/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Failed to generate link');
      } else {
        setGeneratedUrl(json.url);
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  }

  const inputClass = 'w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors';
  const labelClass = 'block text-[0.7rem] font-medium text-zinc-500 uppercase tracking-widest mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111113] border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-zinc-100">Generate Feedback Link</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelClass}>Assignment ID *</label>
              <input name="assignmentId" value={form.assignmentId} onChange={handleChange} required placeholder="e.g. ASN-2024-001" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Client Name *</label>
              <input name="clientName" value={form.clientName} onChange={handleChange} required placeholder="Full name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Client Phone *</label>
              <input name="clientPhone" value={form.clientPhone} onChange={handleChange} required placeholder="+1 234 567 8900" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sales Person *</label>
              <input name="salesPersonName" value={form.salesPersonName} onChange={handleChange} required placeholder="Sales person name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Service Date *</label>
              <input type="date" name="servicedate" value={form.servicedate} onChange={handleChange} required className={inputClass + ' [color-scheme:dark]'} />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-1">
            {[{ name: 'hasCar', label: 'Car Service' }, { name: 'hasBodyguard', label: 'Bodyguard Service' }].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${form[name] ? 'bg-amber-500 border-amber-500' : 'border-zinc-600 bg-zinc-900 group-hover:border-zinc-400'}`}>
                  {form[name] && (
                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="sr-only" />
                </div>
                <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
              </label>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {generatedUrl ? (
            <div className="space-y-3">
              <p className={labelClass}>Generated Link</p>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <p className="text-xs text-emerald-300 break-all font-mono mb-3">{generatedUrl}</p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {copied
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    }
                  </svg>
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setGeneratedUrl(''); setForm({ assignmentId: '', clientName: '', clientPhone: '', hasBodyguard: false, hasCar: false, salesPersonName: '', servicedate: '' }); }}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                ← Generate another
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
            >
              {loading ? 'Generating…' : 'Generate Link'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

function LoginScreen({ onUnlock }) {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setChecking(true);
    try {
      const res = await fetch('/api/admin/feedback?page=1&limit=1&search=', {
        headers: { 'x-admin-key': keyInput },
      });
      if (res.status === 401) {
        setError('Invalid admin key. Please try again.');
      } else {
        onUnlock(keyInput);
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 mb-5">
            <svg className="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">WENS Force</h1>
          <p className="text-sm text-zinc-500 mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-[#111113] border border-zinc-800 rounded-2xl p-7 shadow-2xl">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-5">Enter Admin Key</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="••••••••••••"
              required
              autoFocus
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
            />
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={checking || !keyInput}
              className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-900 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
            >
              {checking ? 'Verifying…' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState(() =>
    typeof window !== 'undefined' ? sessionStorage.getItem('admin_key') || '' : ''
  );
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showGenerateLink, setShowGenerateLink] = useState(false);

  function handleUnlock(key) {
    sessionStorage.setItem('admin_key', key);
    setAdminKey(key);
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_key');
    setAdminKey('');
  }

  const fetchFeedbacks = useCallback(async (page, searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pagination.limit),
        search: searchQuery,
      });
      const res = await fetch(`/api/admin/feedback?${params}`, {
        headers: { 'x-admin-key': adminKey },
      });
      if (res.status === 401) {
        sessionStorage.removeItem('admin_key');
        setAdminKey('');
        return;
      }
      const json = await res.json();
      setFeedbacks(json.data || []);
      setPagination(json.pagination || { total: 0, page: 1, limit: 10, pages: 1 });
    } catch {
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, adminKey]);

  useEffect(() => {
    if (adminKey) fetchFeedbacks(1, search);
  }, [search, adminKey]);

  if (!adminKey) return <LoginScreen onUnlock={handleUnlock} />;

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput('');
    setSearch('');
  }

  function handlePageChange(newPage) {
    fetchFeedbacks(newPage, search);
  }

  function handleStatusChange(id, newStatus) {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
    }
  }

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-zinc-100">
      <header className="bg-[#111113] border-b border-zinc-800 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-base font-bold text-zinc-100 tracking-tight">WENS Force</h1>
              <p className="text-xs text-zinc-500">Feedback Dashboard</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-center">
              <p className="text-lg font-bold text-zinc-100 leading-none">{pagination.total}</p>
              <p className="text-[0.65rem] text-zinc-500 uppercase tracking-widest mt-0.5">Total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGenerateLink(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-white rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Generate Link
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by client name, assignment ID, or comments…"
              className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
            {searchInput && (
              <button type="button" onClick={handleClearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button type="submit" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-sm font-medium transition-colors border border-zinc-700">
            Search
          </button>
        </form>

        {search && (
          <div className="flex items-center gap-2 mb-4 text-sm text-zinc-500">
            <span>Results for</span>
            <span className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded-md font-mono text-xs">"{search}"</span>
            <button onClick={handleClearSearch} className="text-zinc-400 hover:text-zinc-200 text-xs transition-colors">× Clear</button>
          </div>
        )}

        <div className="bg-[#111113] border border-zinc-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-7 h-7 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
              <p className="text-sm text-zinc-600">Loading feedback…</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-600">
              <svg className="w-10 h-10 mb-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium text-zinc-400">No feedback found</p>
              {search && <p className="text-sm mt-1 text-zinc-600">Try a different search term</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">#</th>
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">Client</th>
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">Assignment ID</th>
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">Service Date</th>
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">Overall</th>
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="text-left px-5 py-3.5 text-[0.7rem] font-semibold text-zinc-500 uppercase tracking-widest">Submitted</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {feedbacks.map((fb) => (
                    <tr key={fb.id} className="hover:bg-zinc-900/60 transition-colors group">
                      <td className="px-5 py-4 text-zinc-600 font-mono text-xs">{fb.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-zinc-100">{fb.clientName}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{fb.clientPhone}</p>
                      </td>
                      <td className="px-5 py-4 font-mono text-zinc-400 text-xs">{fb.assignmentId}</td>
                      <td className="px-5 py-4 text-zinc-400 text-sm">{new Date(fb.servicedate).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        {fb.alreadySubmitted
                          ? <StarRating value={fb.overallExperience} />
                          : <span className="text-xs text-zinc-600 italic">Pending</span>
                        }
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[0.7rem] font-semibold tracking-wide ${STATUS_COLORS[fb.status]}`}>
                          {fb.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-zinc-600 text-xs font-mono">{new Date(fb.submissionDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedFeedback(fb)}
                          className="text-xs font-medium text-zinc-400 hover:text-zinc-100 px-3 py-1.5 border border-zinc-800 hover:border-zinc-600 rounded-lg transition-all group-hover:border-zinc-700"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && feedbacks.length > 0 && (
          <div className="flex items-center justify-between mt-5">
            <p className="text-xs text-zinc-600 font-mono">{startItem}–{endItem} of {pagination.total}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-zinc-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - pagination.page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-zinc-600 text-xs">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => handlePageChange(item)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        pagination.page === item
                          ? 'bg-zinc-100 text-zinc-900'
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-zinc-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onStatusChange={handleStatusChange}
          adminKey={adminKey}
        />
      )}
      {showGenerateLink && (
        <GenerateLinkModal
          onClose={() => setShowGenerateLink(false)}
          adminKey={adminKey}
        />
      )}
    </div>
  );
}

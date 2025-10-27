import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function CandidateDashboard() {
  // guard in case the hook isn’t initialized yet
  const auth = typeof useAuth === 'function' ? useAuth() : { user: null, isCandidate: () => true };
  const { user } = auth;

  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // adjust the endpoint if your backend route differs
        const res = await api.get('/insights/market');
        if (!cancelled) setMarketData(res.data);
      } catch (e) {
        if (!cancelled) setError('Failed to load market data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <main style={{ padding: 16 }}>Loading…</main>;
  if (error)   return <main style={{ padding: 16 }}>{error}</main>;

  return (
    <main style={{ padding: 16 }}>
      <h1>Candidate Dashboard</h1>
      {user && <p>Welcome, {user.name || user.email}</p>}

      <section>
        <h2>Market Insights</h2>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(marketData, null, 2)}
        </pre>
      </section>
    </main>
  );
}

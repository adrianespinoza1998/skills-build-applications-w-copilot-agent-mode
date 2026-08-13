import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';
};

const normalizeRecords = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const endpoint = getApiBaseUrl();

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEntries(normalizeRecords(data));
        setLoading(false);
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load leaderboard.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="alert alert-light border">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h3 mb-1">Leaderboard</h2>
            <p className="text-muted mb-0">Top performers this week</p>
          </div>
          <span className="badge bg-warning text-dark rounded-pill">{entries.length} ranked</span>
        </div>

        <div className="list-group list-group-flush">
          {entries.map((entry) => (
            <div key={entry._id || entry.userId || entry.name} className="list-group-item px-0">
              <div className="d-flex justify-content-between align-items-center gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="badge bg-dark rounded-pill">#{entry.rank ?? 1}</span>
                  <div>
                    <div className="fw-semibold">{entry.userId?.name || entry.name}</div>
                    <small className="text-muted">{entry.team || entry.userId?.team || 'Community'}</small>
                  </div>
                </div>
                <strong>{entry.points ?? 0}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Leaderboard;

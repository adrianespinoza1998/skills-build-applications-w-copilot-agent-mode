import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
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

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiBaseUrl = getApiBaseUrl();
    const endpoint = `${apiBaseUrl}/api/teams/`;

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTeams(normalizeRecords(data));
        setLoading(false);
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load teams.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="alert alert-light border">Loading teams...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h3 mb-1">Teams</h2>
            <p className="text-muted mb-0">Community squads and performance groups</p>
          </div>
          <span className="badge bg-info rounded-pill">{teams.length} teams</span>
        </div>

        <div className="row g-3">
          {teams.map((team) => (
            <div key={team._id || team.name} className="col-md-6 col-xl-4">
              <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h3 className="h5 mb-0">{team.name}</h3>
                  <span className="badge bg-secondary-subtle text-secondary-emphasis">{team.totalPoints ?? 0} pts</span>
                </div>
                <p className="text-muted mb-2">Captain: {team.captain || 'TBD'}</p>
                <div className="small text-muted">Members: {team.members?.length ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Teams;

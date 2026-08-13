import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';
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

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
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
        setWorkouts(normalizeRecords(data));
        setLoading(false);
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load workouts.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="alert alert-light border">Loading workouts...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h3 mb-1">Workouts</h2>
            <p className="text-muted mb-0">Suggested sessions and training plans</p>
          </div>
          <span className="badge bg-danger rounded-pill">{workouts.length} workouts</span>
        </div>

        <div className="row g-3">
          {workouts.map((workout) => (
            <div key={workout._id || workout.title} className="col-md-6 col-xl-4">
              <div className="border rounded-4 p-3 h-100 bg-light-subtle">
                <div className="d-flex justify-content-between align-items-start mb-2 gap-2">
                  <h3 className="h5 mb-0">{workout.title}</h3>
                  <span className="badge bg-light text-dark border">{workout.difficulty || 'Moderate'}</span>
                </div>
                <p className="text-muted mb-2">{workout.focus}</p>
                <div className="small text-muted">{workout.duration || 0} minutes</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Workouts;

import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';
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

function Activities() {
  const [activities, setActivities] = useState([]);
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
        setActivities(normalizeRecords(data));
        setLoading(false);
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load activities.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="alert alert-light border">Loading activities...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h3 mb-1">Activities</h2>
            <p className="text-muted mb-0">Recent workouts and movement logs</p>
          </div>
          <span className="badge bg-success rounded-pill">{activities.length} entries</span>
        </div>

        <div className="list-group list-group-flush">
          {activities.map((activity) => (
            <div key={activity._id || `${activity.type}-${activity.date}`} className="list-group-item px-0">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <div className="fw-semibold">{activity.type}</div>
                  <small className="text-muted">
                    {activity.userId?.name || 'User'} • {activity.date || 'Unknown date'}
                  </small>
                </div>
                <div className="text-end small text-muted">
                  <div>{activity.duration || 0} min</div>
                  <div>{activity.calories || 0} cal</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Activities;

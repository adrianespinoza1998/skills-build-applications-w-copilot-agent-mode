import { useEffect, useState } from 'react';

const getApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';
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

function Users() {
  const [users, setUsers] = useState([]);
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
        setUsers(normalizeRecords(data));
        setLoading(false);
      })
      .catch((fetchError) => {
        setError(fetchError.message || 'Unable to load users.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="alert alert-light border">Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="card shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="h3 mb-1">Users</h2>
            <p className="text-muted mb-0">Athletes and community members</p>
          </div>
          <span className="badge bg-primary rounded-pill">{users.length} users</span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th className="text-end">Points</th>
                <th className="text-end">Workouts</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.email || user.name}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.team || 'Unassigned'}</td>
                  <td className="text-end">{user.points ?? 0}</td>
                  <td className="text-end">{user.workouts ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Users;

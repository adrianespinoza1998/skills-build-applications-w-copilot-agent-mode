import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Teams from './components/Teams.jsx';
import Users from './components/Users.jsx';
import Workouts from './components/Workouts.jsx';
import logo from '../../../docs/octofitapp-small.png';

const navigation = [
  { to: '/users', label: 'Users' },
  { to: '/teams', label: 'Teams' },
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/workouts', label: 'Workouts' },
];

function AppLayout() {
  return (
    <div className="container py-4">
      <header className="mb-4">
        <nav className="navbar navbar-expand-lg navbar-light bg-white rounded-4 shadow-sm border">
          <div className="container-fluid px-4 py-3">
            <div className="d-flex align-items-center me-3">
              <img src={logo} alt="Octofit Tracker logo" height="42" className="me-3" />
              <div>
                <div className="fw-bold text-dark">Octofit Tracker</div>
                <small className="text-muted">Fitness community dashboard</small>
              </div>
            </div>

            <div className="navbar-nav flex-row flex-wrap gap-2 ms-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-pill ${isActive ? 'bg-primary text-white' : 'text-dark'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="row g-4">
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;

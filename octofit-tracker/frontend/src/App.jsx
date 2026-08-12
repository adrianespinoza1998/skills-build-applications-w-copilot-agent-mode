import './App.css'

function App() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5 text-center">
              <span className="badge bg-success-subtle text-success-emphasis mb-3 px-3 py-2 rounded-pill">
                OctoFit Tracker
              </span>
              <h1 className="display-5 fw-bold mb-3">Fitness, teams, and progress in one place</h1>
              <p className="lead text-muted mb-4">
                A modern multi-tier application for tracking workouts, communities, and leaderboard momentum.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button type="button" className="btn btn-primary btn-lg px-4">
                  View dashboard
                </button>
                <button type="button" className="btn btn-outline-secondary btn-lg px-4">
                  Join a team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App

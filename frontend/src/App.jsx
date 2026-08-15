import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ElectionDetails from './pages/ElectionDetails'
import './App.css'

function Home() {
  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">NIRVACH</div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#security">Security</a>
          <a href="#how-it-works">How It Works</a>

          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </nav>

      <main className="hero-section">
        <div className="hero-content">

          <p className="tagline">
            THE FUTURE OF DIGITAL DEMOCRACY
          </p>

          <h1>
            Your Vote.
            <br />
            <span>Your Voice.</span>
          </h1>

          <p className="description">
            Nirvach is a secure digital voting platform designed
            to make elections transparent, accessible, and trustworthy.
          </p>

          <div className="hero-buttons">

            <Link to="/login" className="primary-btn">
              Get Started
            </Link>

            <button className="secondary-btn">
              Learn More
            </button>

          </div>

        </div>
      </main>

      <section className="features">

        <div className="feature">
          <h3>Secure</h3>
          <p>
            Modern authentication and cryptographic techniques
            protect your vote.
          </p>
        </div>

        <div className="feature">
          <h3>Transparent</h3>
          <p>
            Blockchain technology provides a tamper-resistant
            record of votes.
          </p>
        </div>

        <div className="feature">
          <h3>Accessible</h3>
          <p>
            Vote digitally through a simple and user-friendly interface.
          </p>
        </div>

      </section>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route
           path="/election/:electionId"
           element={<ElectionDetails />}
         />

      </Routes>
    </BrowserRouter>
  )
}

export default App

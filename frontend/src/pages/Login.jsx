import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('voter')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      console.log('=================================')
      console.log('NIRVACH LOGIN')
      console.log('Selected role:', role)
      console.log('Server response:', data)
      console.log('=================================')

      if (!data.success) {
        setError(data.message || 'Login failed')
        return
      }

      // Make sure the selected login role matches
      // the actual role stored in the database.
      if (data.user.role !== role) {
        setError(
          `This account is registered as ${data.user.role}, not ${role}.`
        )
        return
      }

      // Save authentication information
      localStorage.setItem('nirvachToken', data.token)
      localStorage.setItem(
        'nirvachUser',
        JSON.stringify(data.user)
      )

      console.log('Login successful')
      console.log('User:', data.user)

      // Redirect according to role
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }

    } catch (error) {
      console.error('Could not connect to backend:', error)
      setError('Could not connect to backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Welcome to Nirvach</h1>

        <p className="login-subtitle">
          Secure digital voting starts here.
        </p>

        <div className="role-selector">

          <p className="role-title">
            Login as
          </p>

          <div className="role-buttons">

            <button
              type="button"
              className={
                role === 'voter'
                  ? 'role-btn role-active'
                  : 'role-btn'
              }
              onClick={() => setRole('voter')}
            >
              🗳️ Voter
            </button>

            <button
              type="button"
              className={
                role === 'admin'
                  ? 'role-btn role-active'
                  : 'role-btn'
              }
              onClick={() => setRole('admin')}
            >
              🔐 Admin
            </button>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />

          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? 'Logging in...'
              : `Login as ${role === 'admin' ? 'Admin' : 'Voter'}`}
          </button>

        </form>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <p className="register-text">
          Don't have an account?{' '}

          <Link to="/register">
            Register as Voter
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login

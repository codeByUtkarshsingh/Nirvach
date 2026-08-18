import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  const [role, setRole] = useState('voter')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [adminKey, setAdminKey] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setError('')
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (role === 'admin' && !adminKey) {
      setError('Admin registration key is required.')
      return
    }

    setLoading(true)

    try {
      const endpoint =
        role === 'admin'
          ? 'http://localhost:3000/api/auth/register-admin'
          : 'http://localhost:3000/api/auth/register'

      const requestBody =
        role === 'admin'
          ? {
              fullName,
              email,
              password,
              adminKey,
            }
          : {
              fullName,
              email,
              password,
            }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      console.log('=================================')
      console.log('NIRVACH REGISTRATION')
      console.log('Registration type:', role)
      console.log('Server response:', data)
      console.log('=================================')

      if (data.success) {
        setMessage(
          `${role === 'admin' ? 'Admin' : 'Voter'} registered successfully. Redirecting to login...`
        )

        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        setError(data.message || 'Registration failed')
      }

    } catch (error) {
      console.error('Registration error:', error)
      setError('Could not connect to backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>Create Account</h1>

        <p className="login-subtitle">
          Register for the Nirvach voting platform.
        </p>

        <div className="role-selector">

          <p className="role-title">
            Register as
          </p>

          <div className="role-buttons">

            <button
              type="button"
              className={
                role === 'voter'
                  ? 'role-btn role-active'
                  : 'role-btn'
              }
              onClick={() => handleRoleChange('voter')}
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
              onClick={() => handleRoleChange('admin')}
            >
              🔐 Admin
            </button>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <label htmlFor="fullName">
            Full Name
          </label>

          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            required
          />

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
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            required
          />

          {role === 'admin' && (
            <>
              <label htmlFor="adminKey">
                Admin Registration Key
              </label>

              <input
                id="adminKey"
                type="password"
                placeholder="Enter admin registration key"
                value={adminKey}
                onChange={(event) =>
                  setAdminKey(event.target.value)
                }
                required
              />
            </>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : role === 'admin'
                ? 'Create Admin Account'
                : 'Create Voter Account'}
          </button>

        </form>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        {message && (
          <p className="register-success">
            {message}
          </p>
        )}

        <p className="register-text">
          Already have an account?{' '}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Register

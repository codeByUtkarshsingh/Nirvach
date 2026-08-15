import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

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

      console.log('Server response:', data)

      if (data.success) {
        // Save JWT token
        localStorage.setItem('nirvachToken', data.token)

        console.log('Login successful')

        // Go to dashboard
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }

    } catch (error) {
      console.error('Could not connect to backend:', error)
      setError('Could not connect to backend')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Welcome to Nirvach</h1>

        <p className="login-subtitle">
          Secure digital voting starts here.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            className="primary-btn"
          >
            Login
          </button>

        </form>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <p className="register-text">
          Don't have an account? <span>Register</span>
        </p>

      </div>
    </div>
  )
}

export default Login

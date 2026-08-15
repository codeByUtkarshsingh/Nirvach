import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [elections, setElections] = useState([])
  const [error, setError] = useState('')
  const [electionsLoading, setElectionsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('nirvachToken')

    if (!token) {
      setError('You are not logged in.')
      setElectionsLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        // Get authenticated user
        const userResponse = await fetch(
          'http://localhost:3000/api/protected',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const userData = await userResponse.json()

        if (!userData.success) {
          setError(userData.message || 'Could not load user')
          setElectionsLoading(false)
          return
        }

        setUser(userData.user)

        // Get active elections
        const electionResponse = await fetch(
          'http://localhost:3000/api/elections',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const electionData = await electionResponse.json()

        if (electionData.success) {
          setElections(electionData.elections)
        } else {
          setError(
            electionData.message || 'Could not load elections'
          )
        }

      } catch (error) {
        console.error(error)
        setError('Could not connect to backend')
      } finally {
        setElectionsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (error) {
    return <h2>{error}</h2>
  }

  if (!user) {
    return <h2>Loading...</h2>
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Welcome to Nirvach</h1>

        <h2>Voter Dashboard</h2>

        <p>
          User ID: {user.userId}
        </p>

        <p>
          Role: {user.role}
        </p>
      </div>

      <section className="elections-section">

        <h2>Active Elections</h2>

        {electionsLoading ? (
          <p>Loading elections...</p>
        ) : elections.length === 0 ? (
          <p>No active elections available.</p>
        ) : (
          <div className="elections-list">

            {elections.map((election) => (
              <div
                className="election-card"
                key={election._id}
              >

                <h3>{election.title}</h3>

                <p>
                  {election.description}
                </p>

                <p>
                  <strong>Starts:</strong>{' '}
                  {new Date(election.startDate).toLocaleString()}
                </p>

                <p>
                  <strong>Ends:</strong>{' '}
                  {new Date(election.endDate).toLocaleString()}
                </p>

                 <Link
                    to={`/election/${election._id}`}
                    className="primary-btn"
                  >
                     View Election
                  </Link>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
  )
}

export default Dashboard

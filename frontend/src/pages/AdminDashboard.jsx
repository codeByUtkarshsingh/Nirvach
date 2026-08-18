import { useEffect, useState } from 'react'

function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [elections, setElections] = useState([])
  const [voters, setVoters] = useState([])
  const [candidatesByElection, setCandidatesByElection] = useState({})
  const [showCandidateForm, setShowCandidateForm] = useState(false)
const [selectedElection, setSelectedElection] = useState(null)
const [candidateName, setCandidateName] = useState('')
const [candidateParty, setCandidateParty] = useState('')
const [candidateSymbol, setCandidateSymbol] = useState('')
const [creatingCandidate, setCreatingCandidate] = useState(false)


  const [selectedResults, setSelectedResults] = useState(null)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [finishingElection, setFinishingElection] = useState(false)


 const [electionCandidates, setElectionCandidates] = useState({})
const [candidatesLoading, setCandidatesLoading] = useState({})


  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showElectionForm, setShowElectionForm] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [creatingElection, setCreatingElection] = useState(false)
  const [message, setMessage] = useState('')

  const token = localStorage.getItem('nirvachToken')

  useEffect(() => {
    const storedUser = localStorage.getItem('nirvachUser')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (!token) {
      setError('You are not logged in.')
      setLoading(false)
      return
    }

    fetchAdminData()
  }, [])


const loadCandidates = async (electionId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/candidates/${electionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    console.log('Candidates response:', data)

    if (data.success) {
      setCandidatesByElection((previous) => ({
        ...previous,
        [electionId]: data.candidates,
      }))
    } else {
      setError(
        data.message || 'Could not load candidates'
      )
    }

  } catch (error) {
    console.error('Load candidates error:', error)
    setError('Could not connect to backend')
  }
}


const fetchAdminData = async () => {
    try {
      setError('')

      const electionResponse = await fetch(
        'http://localhost:3000/api/elections',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const electionData = await electionResponse.json()

      if (!electionData.success) {
        setError(
          electionData.message || 'Could not load elections'
        )
        return
      }

      setElections(electionData.elections)

      const voterResponse = await fetch(
        'http://localhost:3000/api/users/voters',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const voterData = await voterResponse.json()

      if (voterData.success) {
        setVoters(voterData.voters)
      }

    } catch (error) {
      console.error('Admin dashboard error:', error)
      setError('Could not connect to backend')
    } finally {
      setLoading(false)
    }
  }




  const handleCreateElection = async (event) => {
    event.preventDefault()

    setCreatingElection(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        'http://localhost:3000/api/elections/create',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            startDate,
            endDate,
          }),
        }
      )

      const data = await response.json()

      console.log('Election creation response:', data)

      if (data.success) {
        setMessage('Election created successfully.')

        setTitle('')
        setDescription('')
        setStartDate('')
        setEndDate('')
        setShowElectionForm(false)

        fetchAdminData()
      } else {
        setError(
          data.message || 'Could not create election'
        )
      }

    } catch (error) {
      console.error('Election creation error:', error)
      setError('Could not connect to backend')
    } finally {
      setCreatingElection(false)
    }
  }

 const handleViewResults = async (electionId) => {
  setResultsLoading(true)
  setError('')

  try {
    const response = await fetch(
      `http://localhost:3000/api/results/${electionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    console.log('Election results:', data)

    if (data.success) {
      setSelectedResults(data)
    } else {
      setError(
        data.message || 'Could not load election results'
      )
    }

  } catch (error) {
    console.error('Results error:', error)
    setError('Could not connect to backend')
  } finally {
    setResultsLoading(false)
  }
}

const handleFinishElection = async (electionId) => {
  const confirmed = window.confirm(
    'Are you sure you want to finish this election? This action cannot be undone.'
  )

  if (!confirmed) {
    return
  }

  setFinishingElection(true)
  setError('')
  setMessage('')

  try {
    const response = await fetch(
      `http://localhost:3000/api/elections/finish/${electionId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (data.success) {
      setMessage(
        `Election completed successfully. Winner: ${data.election.winner.name}`
      )

      // Reload elections so the completed election
      // disappears from Active Elections
      fetchAdminData()
    } else {
      setError(
        data.message || 'Could not finish election'
      )
    }

  } catch (error) {
    console.error('Finish election error:', error)
    setError('Could not connect to backend')
  } finally {
    setFinishingElection(false)
  }
}

const handleCreateCandidate = async (event) => {
  event.preventDefault()

  if (!selectedElection) {
    setError('Please select an election.')
    return
  }

  setCreatingCandidate(true)
  setError('')
  setMessage('')

  try {
    const response = await fetch(
      'http://localhost:3000/api/candidates/create',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: candidateName,
          party: candidateParty,
          symbol: candidateSymbol,
          electionId: selectedElection._id,
        }),
      }
    )

    const data = await response.json()

    console.log('Candidate creation response:', data)

    if (data.success) {
      setMessage(
        `Candidate ${candidateName} added successfully.`
      )

      setCandidateName('')
      setCandidateParty('')
      setCandidateSymbol('')

      setShowCandidateForm(false)
      setSelectedElection(null)
    } else {
      setError(
        data.message || 'Could not create candidate'
      )
    }

  } catch (error) {
    console.error('Candidate creation error:', error)
    setError('Could not connect to backend')
  } finally {
    setCreatingCandidate(false)
  }
}

const handleWithdrawCandidate = async (candidateId, electionId) => {
  const confirmed = window.confirm(
    'Are you sure you want to withdraw this candidate?'
  )

  if (!confirmed) {
    return
  }

  setError('')
  setMessage('')

  try {
    const response = await fetch(
      `http://localhost:3000/api/candidates/${candidateId}/withdraw`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    console.log('Candidate withdrawal response:', data)

    if (data.success) {
      setMessage('Candidate withdrawn successfully.')

      await loadCandidates(electionId)
    } else {
      setError(
        data.message || 'Could not withdraw candidate'
      )
    }

  } catch (error) {
    console.error('Candidate withdrawal error:', error)
    setError('Could not connect to backend')
  }
}



  const handleActivateElection = async (electionId) => {
    setError('')
    setMessage('')

    try {
      const response = await fetch(
        `http://localhost:3000/api/elections/activate/${electionId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      console.log('Election activation response:', data)

      if (data.success) {
        setMessage('Election activated successfully.')
        fetchAdminData()
      } else {
        setError(
          data.message || 'Could not activate election'
        )
      }

    } catch (error) {
      console.error('Election activation error:', error)
      setError('Could not connect to backend')
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <h2>Loading admin dashboard...</h2>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="admin-page">
        <h2>{error}</h2>
      </div>
    )
  }

  return (
    <div className="admin-page">

      <header className="admin-header">

        <div>
          <p className="section-label">
            NIRVACH ADMIN PANEL
          </p>

          <h1>
            Welcome, {user?.fullName}
          </h1>

          <p>
            Manage elections, candidates and voters.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => {
            localStorage.removeItem('nirvachToken')
            localStorage.removeItem('nirvachUser')
            window.location.href = '/login'
          }}
        >
          Logout
        </button>

      </header>

      {message && (
        <div className="admin-success">
          {message}
        </div>
      )}

      {error && (
        <div className="error-box">
          {error}
        </div>
      )}

      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>REGISTERED VOTERS</span>
          <strong>{voters.length}</strong>
        </div>

        <div className="admin-stat-card">
            <span>ACTIVE ELECTIONS</span>
<strong>
  {elections.filter(
    (election) => election.isActive && !election.isCompleted
  ).length}
</strong>
        </div>

      </section>

      <section className="admin-section">

        <div className="admin-section-heading">

          <div>
            <p className="section-label">
              ELECTION MANAGEMENT
            </p>

            <h2>
              Elections
            </h2>
          </div>

          <button
            className="primary-btn"
            onClick={() =>
              setShowElectionForm(!showElectionForm)
            }
          >
            {showElectionForm
              ? 'Cancel'
              : '+ Create Election'}
          </button>

        </div>

        {showElectionForm && (

          <form
            className="admin-form"
            onSubmit={handleCreateElection}
          >

            <label>
              Election Title
            </label>

            <input
              type="text"
              placeholder="e.g. Nirvach Student Council Election 2026"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />

            <label>
              Description
            </label>

            <textarea
              placeholder="Describe the election"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />

            <div className="admin-form-row">

              <div>
                <label>
                  Start Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(event.target.value)
                  }
                  required
                />
              </div>

              <div>
                <label>
                  End Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(event.target.value)
                  }
                  required
                />
              </div>

            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={creatingElection}
            >
              {creatingElection
                ? 'Creating...'
                : 'Create Election'}
            </button>

          </form>

        )}

        {elections.length === 0 ? (

          <div className="empty-candidates">
            <h3>No elections found</h3>
            <p>
              Create your first election above.
            </p>
          </div>

        ) : (

          <div className="admin-election-list">

            {elections
  .filter((election) => !election.isCompleted)
  .map((election) => (

              <div
                className="admin-election-card"
                key={election._id}
              >

                <div className="admin-election-info">

                  <div className="admin-election-title-row">

                    <h3>
                      {election.title}
                    </h3>

                    <span
                      className={
                        election.isActive
                          ? 'active-badge'
                          : 'inactive-badge'
                      }
                    >
                      {election.isActive
                        ? 'ACTIVE'
                        : 'INACTIVE'}
                    </span>

                  </div>

                  <p>
                    {election.description}
                  </p>

                  <small>
                    {new Date(
                      election.startDate
                    ).toLocaleString()}
                    {' → '}
                    {new Date(
                      election.endDate
                    ).toLocaleString()}
                  </small>

                </div>

                {!election.isActive && (

                  <button
                    className="primary-btn"
                    onClick={() =>
                      handleActivateElection(
                        election._id
                      )
                    }
                  >
                    Activate
                  </button>

                )}

             <div className="candidate-management">

  <button
    className="secondary-btn"
    onClick={() => {
      setSelectedElection(election)
      setShowCandidateForm(true)
      loadCandidates(election._id)
    }}
  >
    + Add Candidate
  </button>

  {candidatesByElection[election._id]?.map((candidate) => (

    <div
      className="admin-candidate-row"
      key={candidate._id}
    >

      <span className="admin-candidate-symbol">
        {candidate.symbol || '🗳️'}
      </span>

      <div>
        <strong>{candidate.name}</strong>
        <small>
          {candidate.party || 'Independent'}
        </small>
      </div>

    </div>

  ))}
</div>

{showCandidateForm &&
  selectedElection?._id === election._id && (

    <form
      className="candidate-form"
      onSubmit={handleCreateCandidate}
    >

      <h3>
        Add Candidate
      </h3>

      <input
        type="text"
        placeholder="Candidate Name"
        value={candidateName}
        onChange={(event) =>
          setCandidateName(event.target.value)
        }
        required
      />

      <input
        type="text"
        placeholder="Party Name"
        value={candidateParty}
        onChange={(event) =>
          setCandidateParty(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Election Symbol e.g. 🌟"
        value={candidateSymbol}
        onChange={(event) =>
          setCandidateSymbol(event.target.value)
        }
      />

      <div className="candidate-form-actions">

        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            setShowCandidateForm(false)
            setSelectedElection(null)
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-btn"
          disabled={creatingCandidate}
        >
          {creatingCandidate
            ? 'Adding...'
            : 'Add Candidate'}
        </button>

      </div>

    </form>

  )}

<button
  className="secondary-btn"
  onClick={() =>
    handleViewResults(election._id)
  }

  disabled={resultsLoading}
>
  {resultsLoading ? 'Loading...' : 'View Results'}
</button>


<button
  className="danger-btn"
  onClick={() =>
    handleFinishElection(election._id)
  }
  disabled={finishingElection}
>
  {finishingElection ? 'Finishing...' : 'Finish Election'}
</button>


              </div>

            ))}

          </div>

        )}

      </section>


              <section className="admin-section">

        <div className="admin-section-heading">

          <div>
            <p className="section-label">
              COMPLETED ELECTIONS
            </p>

            <h2>
              Election Winners
            </h2>
          </div>

        </div>

        {elections.filter((election) => election.isCompleted).length === 0 ? (

          <div className="empty-candidates">
            <h3>No completed elections</h3>
            <p>
              Completed elections will appear here with their winners.
            </p>
          </div>

        ) : (

          <div className="admin-election-list">

            {elections
              .filter((election) => election.isCompleted)
              .map((election) => (

                <div
                  className="admin-election-card"
                  key={election._id}
                >

                  <div className="admin-election-info">

                    <div className="admin-election-title-row">

                      <h3>
                        {election.title}
                      </h3>

                      <span className="inactive-badge">
                        COMPLETED
                      </span>

                    </div>

                    <p>
                      {election.description}
                    </p>

                    <small>
                      {new Date(
                        election.startDate
                      ).toLocaleString()}
                      {' → '}
                      {new Date(
                        election.endDate
                      ).toLocaleString()}
                    </small>

                    <div className="election-winner">

                      <strong>
                        Winner
                      </strong>

                      <p>
                        {election.winner?.name || 'Winner unavailable'}
                      </p>

                      {election.winner?.party && (
                        <small>
                          {election.winner.party}
                        </small>
                      )}

                      <small>
                        Votes: {election.winnerVoteCount || 0}
                      </small>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>

              {selectedResults && (

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <p className="section-label">
                ELECTION RESULTS
              </p>

              <h2>
                {selectedResults.election.title}
              </h2>
            </div>

            <button
              className="secondary-btn"
              onClick={() =>
                setSelectedResults(null)
              }
            >
              Close Results
            </button>

          </div>

          <div className="admin-stats">

            <div className="admin-stat-card">
              <span>REGISTERED VOTERS</span>
              <strong>
                {selectedResults.statistics.totalVoters}
              </strong>
            </div>

            <div className="admin-stat-card">
              <span>TOTAL VOTES CAST</span>
              <strong>
                {selectedResults.statistics.totalVotes}
              </strong>
            </div>

            <div className="admin-stat-card">
              <span>VOTER TURNOUT</span>
              <strong>
                {selectedResults.statistics.turnout}%
              </strong>
            </div>

          </div>

          <div className="results-list">

            {selectedResults.candidates.map(
              (candidate) => (

                <div
                  className="result-card"
                  key={candidate.candidateId}
                >

                  <div className="result-candidate">

                    <span className="result-symbol">
                      {candidate.symbol || '🗳️'}
                    </span>

                    <div>
                      <h3>
                        {candidate.name}
                      </h3>

                      <p>
                        {candidate.party || 'Independent'}
                      </p>
                    </div>

                  </div>

                  <div className="result-votes">

                    <strong>
                      {candidate.votes}
                    </strong>

                    <span>
                      {candidate.votes === 1
                        ? 'Vote'
                        : 'Votes'}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}

    </div>
  )
}

export default AdminDashboard

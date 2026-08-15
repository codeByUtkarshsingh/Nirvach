import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function ElectionDetails() {
  const { electionId } = useParams()

  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  const [voteSuccess, setVoteSuccess] = useState(null)

  const [verification, setVerification] = useState(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('nirvachToken')

    if (!token) {
      setError('You are not logged in.')
      setLoading(false)
      return
    }

    const fetchElectionData = async () => {
      try {
        // Fetch active elections
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
            electionData.message || 'Could not load election'
          )
          return
        }

        // Find the election currently being viewed
        const selectedElection = electionData.elections.find(
          (item) => item._id === electionId
        )

        if (!selectedElection) {
          setError('Election not found')
          return
        }

        setElection(selectedElection)

        // Fetch candidates
        const candidateResponse = await fetch(
          `http://localhost:3000/api/candidates/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const candidateData = await candidateResponse.json()

        if (candidateData.success) {
          setCandidates(candidateData.candidates)
        } else {
          setError(
            candidateData.message ||
              'Could not load candidates'
          )
        }

      } catch (error) {
        console.error(error)
        setError('Could not connect to backend')
      } finally {
        setLoading(false)
      }
    }

    fetchElectionData()
  }, [electionId])

  // =========================
  // CAST VOTE
  // =========================

  const handleVote = async () => {
    if (!selectedCandidate) {
      return
    }

    const token = localStorage.getItem('nirvachToken')

    if (!token) {
      setError('You are not logged in.')
      return
    }

    setVoting(true)
    setError('')

    try {
      const response = await fetch(
        'http://localhost:3000/api/votes/cast',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            electionId,
            candidateId: selectedCandidate._id,
          }),
        }
      )

      const data = await response.json()

      if (!data.success) {
        setError(
          data.message || 'Vote could not be cast'
        )
        return
      }

      setVoteSuccess(data)
      setSelectedCandidate(null)

    } catch (error) {
      console.error(error)
      setError('Could not connect to backend')
    } finally {
      setVoting(false)
    }
  }

  // =========================
  // VERIFY VOTE
  // =========================

  const handleVerifyVote = async () => {
    if (!voteSuccess?.voteId) {
      return
    }

    setVerifying(true)
    setVerification(null)
    setError('')

    try {
      const response = await fetch(
        `http://localhost:3000/api/votes/verify/${voteSuccess.voteId}`
      )

      const data = await response.json()

      if (!data.success) {
        setError(
          data.message || 'Vote verification failed'
        )
        return
      }

      setVerification(data)

    } catch (error) {
      console.error(error)
      setError('Could not verify vote')
    } finally {
      setVerifying(false)
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="election-details">
        <p>Loading election...</p>
      </div>
    )
  }

  // =========================
  // ERROR
  // =========================

  if (error && !election) {
    return (
      <div className="election-details">

        <h2>{error}</h2>

        <Link
          to="/dashboard"
          className="primary-btn"
        >
          Back to Dashboard
        </Link>

      </div>
    )
  }

  // =========================
  // SUCCESS SCREEN
  // =========================

  if (voteSuccess) {
    return (
      <div className="election-details">

        <div className="vote-success-card">

          <div className="success-icon">
            ✓
          </div>

          <p className="section-label">
            VOTE RECORDED
          </p>

          <h1>
            Vote Cast Successfully
          </h1>

          <p>
            Your vote has been recorded and its
            integrity has been secured using
            blockchain verification.
          </p>

          {/* VOTE INFORMATION */}

          <div className="vote-info">

            <div>
              <span>
                VOTE ID
              </span>

              <strong>
                {voteSuccess.voteId}
              </strong>
            </div>

            <div>
              <span>
                TRANSACTION HASH
              </span>

              <strong>
                {voteSuccess.blockchain?.transactionHash ||
                  'Recorded'}
              </strong>
            </div>

            <div>
              <span>
                BLOCK NUMBER
              </span>

              <strong>
                {voteSuccess.blockchain?.blockNumber ||
                  'Confirmed'}
              </strong>
            </div>

          </div>

          {/* BLOCKCHAIN VERIFICATION */}

          <div className="verification-area">

            {!verification && (
              <button
                className="verify-btn"
                onClick={handleVerifyVote}
                disabled={verifying}
              >
                {verifying
                  ? 'Verifying on Blockchain...'
                  : 'Verify on Blockchain'}
              </button>
            )}

            {verification && (
              <div className="verification-result">

                <div className="verification-icon">
                  ✓
                </div>

                <div>
                  <span>
                    BLOCKCHAIN STATUS
                  </span>

                  <strong>
                    {verification.verified
                      ? ' VERIFIED'
                      : ' NOT VERIFIED'}
                  </strong>
                </div>

              </div>
            )}

            <Link
              to="/dashboard"
              className="secondary-dashboard-btn"
            >
              Return to Dashboard
            </Link>

          </div>

        </div>

      </div>
    )
  }

  // =========================
  // ELECTION PAGE
  // =========================

  return (
    <div className="election-details">

      <Link
        to="/dashboard"
        className="back-link"
      >
        ← Back to Dashboard
      </Link>

      {/* ELECTION HEADER */}

      <div className="election-hero">

        <div className="status-badge">
          ● ACTIVE ELECTION
        </div>

        <h1>
          {election.title}
        </h1>

        <p className="election-description">
          {election.description}
        </p>

        <div className="election-meta">

          <div>

            <span>
              STARTS
            </span>

            <strong>
              {new Date(
                election.startDate
              ).toLocaleString()}
            </strong>

          </div>

          <div>

            <span>
              ENDS
            </span>

            <strong>
              {new Date(
                election.endDate
              ).toLocaleString()}
            </strong>

          </div>

        </div>

      </div>

      {/* CANDIDATES */}

      <section className="candidates-section">

        <div className="section-heading">

          <div>

            <p className="section-label">
              YOUR CHOICE
            </p>

            <h2>
              Select a Candidate
            </h2>

          </div>

          <span className="candidate-count">
            {candidates.length} candidates
          </span>

        </div>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {candidates.length === 0 ? (

          <div className="empty-candidates">

            <div className="empty-icon">
              ◉
            </div>

            <h3>
              No candidates yet
            </h3>

            <p>
              Candidates for this election
              have not been added yet.
            </p>

          </div>

        ) : (

          <div className="candidates-grid">

            {candidates.map((candidate) => {

              const isSelected =
                selectedCandidate?._id ===
                candidate._id

              return (

                <div
                  key={candidate._id}
                  className={`candidate-card ${
                    isSelected
                      ? 'candidate-selected'
                      : ''
                  }`}
                >

                  <div className="candidate-symbol">
                    {candidate.symbol || '◉'}
                  </div>

                  <div className="candidate-info">

                    <h3>
                      {candidate.name}
                    </h3>

                    <p>
                      {candidate.party ||
                        'Independent'}
                    </p>

                  </div>

                  <button
                    className="vote-select-btn"
                    onClick={() =>
                      setSelectedCandidate(
                        candidate
                      )
                    }
                  >
                    {isSelected
                      ? 'Selected ✓'
                      : 'Select'}
                  </button>

                </div>

              )
            })}

          </div>

        )}

      </section>

      {/* CONFIRMATION */}

      {selectedCandidate && (

        <div className="vote-confirmation">

          <div>

            <p className="section-label">
              CONFIRM YOUR VOTE
            </p>

            <h3>
              You selected{' '}
              {selectedCandidate.name}
            </h3>

            <p>
              Once submitted, your vote will be
              recorded and cannot be changed.
            </p>

          </div>

          <div className="confirmation-actions">

            <button
              className="cancel-btn"
              onClick={() =>
                setSelectedCandidate(null)
              }
              disabled={voting}
            >
              Cancel
            </button>

            <button
              className="confirm-vote-btn"
              onClick={handleVote}
              disabled={voting}
            >
              {voting
                ? 'Recording Vote...'
                : 'Confirm Vote'}
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default ElectionDetails

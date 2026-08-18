import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ElectionDetails() {
  const { electionId } = useParams()
  const navigate = useNavigate()

  const [election, setElection] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [voteResult, setVoteResult] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('nirvachToken')

    if (!token) {
      setError('You are not logged in.')
      setLoading(false)
      return
    }

    const fetchElectionData = async () => {
      try {
        console.log('=================================')
        console.log('NIRVACH ELECTION')
        console.log('Election ID:', electionId)
        console.log('=================================')

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

        console.log('Election API response:', electionData)

        if (!electionData.success) {
          setError(
            electionData.message || 'Could not load elections'
          )
          setLoading(false)
          return
        }

        const currentElection = electionData.elections.find(
          (item) => item._id === electionId
        )

        if (!currentElection) {
          setError('Election not found')
          setLoading(false)
          return
        }

        setElection(currentElection)

        // Get candidates
        const candidateResponse = await fetch(
          `http://localhost:3000/api/candidates/${electionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const candidateData = await candidateResponse.json()

        console.log('Candidates API response:', candidateData)

        if (candidateData.success) {
          setCandidates(candidateData.candidates)
        } else {
          setError(
            candidateData.message || 'Could not load candidates'
          )
        }

      } catch (error) {
        console.error('Frontend error:', error)
        setError('Could not connect to backend')
      } finally {
        setLoading(false)
      }
    }

    fetchElectionData()
  }, [electionId])

  const handleVote = async () => {
    const token = localStorage.getItem('nirvachToken')

    if (!token) {
      setError('You are not logged in.')
      return
    }

    if (!selectedCandidate) {
      setError('Please select a candidate first.')
      return
    }

    const candidate = candidates.find(
      (item) => item._id === selectedCandidate
    )

    console.log('=================================')
    console.log('NIRVACH VOTE STARTED')
    console.log('Election:', election?.title)
    console.log('Election ID:', electionId)
    console.log('Candidate:', candidate?.name)
    console.log('Candidate ID:', selectedCandidate)
    console.log('=================================')

    setVoting(true)
    setError('')
    setMessage('')
    setVoteResult(null)

    try {
      const response = await fetch(
        'http://localhost:3000/api/votes/cast',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            electionId,
            candidateId: selectedCandidate,
          }),
        }
      )

      const data = await response.json()

      console.log('Vote API response:', data)

      if (data.success) {
        console.log('=================================')
        console.log('VOTE CAST SUCCESSFULLY')
        console.log('Vote ID:', data.voteId)
        console.log(
          'Transaction Hash:',
          data.blockchain?.transactionHash
        )
        console.log(
          'Block Number:',
          data.blockchain?.blockNumber
        )
        console.log(
          'Vote Hash:',
          data.blockchain?.voteHash
        )
        console.log(
          'Contract Address:',
          data.blockchain?.contractAddress
        )
        console.log('=================================')

        setVoteResult(data)

        setMessage(
          `Vote successfully recorded for ${candidate?.name}`
        )
      } else {
        console.error('Vote failed:', data)
        setError(data.message || 'Vote could not be cast')
      }

    } catch (error) {
      console.error('Vote request failed:', error)
      setError('Could not connect to backend')
    } finally {
      setVoting(false)
    }
  }

  const handleVerifyVote = async () => {
    if (!voteResult?.voteId) {
      return
    }

    console.log('=================================')
    console.log('BLOCKCHAIN VERIFICATION STARTED')
    console.log('Vote ID:', voteResult.voteId)
    console.log('=================================')

    try {
      const response = await fetch(
        `http://localhost:3000/api/votes/verify/${voteResult.voteId}`
      )

      const data = await response.json()

      console.log('Verification response:', data)

      if (data.success) {
        console.log('=================================')
        console.log(
          'BLOCKCHAIN VERIFIED:',
          data.verified
        )
        console.log(
          'Blockchain Timestamp:',
          data.blockchain?.blockchainTimestamp
        )
        console.log('=================================')
      }

    } catch (error) {
      console.error(
        'Blockchain verification failed:',
        error
      )
    }
  }

  if (loading) {
    return (
      <div className="election-details-page">
        <h2>Loading election...</h2>
      </div>
    )
  }

  if (error && !election) {
    return (
      <div className="election-details-page">
        <h2>{error}</h2>
      </div>
    )
  }

  return (
    <div className="election-details-page">

      <div className="election-details-header">

        <button
          className="back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <p className="section-label">
          NIRVACH ELECTION
        </p>

        <h1>
          {election?.title}
        </h1>

        <p className="election-description">
          {election?.description}
        </p>

        <div className="election-status">
          <span className="status-dot"></span>
          Election Active
        </div>

      </div>

      <section className="candidate-section">

        <div className="section-heading">
          <div>
            <p className="section-label">
              CAST YOUR VOTE
            </p>

            <h2>
              Choose a Candidate
            </h2>
          </div>

          <p className="candidate-count">
            {candidates.length} Candidates
          </p>
        </div>

        <div className="candidate-grid">

          {candidates.map((candidate) => (

            <div
              key={candidate._id}
              className={`candidate-card ${
                selectedCandidate === candidate._id
                  ? 'candidate-selected'
                  : ''
              }`}
              onClick={() =>
                setSelectedCandidate(candidate._id)
              }
            >

              <div className="candidate-symbol">
                {candidate.symbol || '🗳️'}
              </div>

              <div className="candidate-info">

                <h3>
                  {candidate.name}
                </h3>

                <p>
                  {candidate.party || 'Independent'}
                </p>

              </div>

              <div className="candidate-radio">

                <span
                  className={
                    selectedCandidate === candidate._id
                      ? 'radio-active'
                      : ''
                  }
                ></span>

              </div>

            </div>

          ))}

        </div>

        {selectedCandidate && !voteResult && (

          <div className="vote-action">

            <p>
              You selected:{' '}
              <strong>
                {
                  candidates.find(
                    (candidate) =>
                      candidate._id === selectedCandidate
                  )?.name
                }
              </strong>
            </p>

            <button
              className="primary-btn vote-btn"
              onClick={handleVote}
              disabled={voting}
            >
              {voting
                ? 'Recording Vote...'
                : 'Confirm & Cast Vote'}
            </button>

          </div>

        )}

        {message && (

          <div className="success-box">

            <h3>✓ Vote Recorded Successfully</h3>

            <p>
              {message}
            </p>

            {voteResult?.blockchain && (

              <div className="blockchain-info">

                <p>
                  <strong>Transaction:</strong>{' '}
                  {voteResult.blockchain.transactionHash}
                </p>

                <p>
                  <strong>Block:</strong>{' '}
                  {voteResult.blockchain.blockNumber}
                </p>

                <p>
                  <strong>Contract:</strong>{' '}
                  {voteResult.blockchain.contractAddress}
                </p>

              </div>

            )}

            <button
              className="secondary-btn verify-btn"
              onClick={handleVerifyVote}
            >
              Verify Vote on Blockchain
            </button>

          </div>

        )}

        {error && (

          <div className="error-box">
            {error}
          </div>

        )}

      </section>

    </div>
  )
}

export default ElectionDetails

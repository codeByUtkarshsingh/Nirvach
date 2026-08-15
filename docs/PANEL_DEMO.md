# Nirvach Panel Demonstration

## 1. Start Backend

Open Terminal 1:

```bash
cd backend
node src/server.js

Expected:

Nirvach server running on http://localhost:3000

2. Start Frontend

Open Terminal 2:cd frontend
npm run dev

Expected:

http://localhost:5173

3. Admin Flow

1. Login as an administrator.
2. Create a new election.
3. Activate the election.
4. Create candidates for the election.

4. Voter Flow

1. Login as a voter.
2. Open the newly created election.
3. View the candidates.
4. Select a candidate.
5. Confirm the vote.

5. Blockchain Flow

After confirming the vote:

1. The backend validates the voter.
2. The backend validates the election.
3. The backend validates the candidate.
4. A cryptographic vote hash is generated.
5. The vote hash is recorded on the blockchain.
6. The blockchain transaction is confirmed.
7. The vote is stored in MongoDB.
8. The transaction hash and block number are returned.

6. Blockchain Verification

The vote can be verified using its vote ID.

Expected result:

verified: true

This confirms that the vote hash exists on the blockchain.

7. Important Demo Points

During the panel demonstration, explain:

* JWT protects authenticated routes.
* Admin routes require the admin role.
* Only eligible voters can vote.
* A voter cannot vote twice in the same election.
* MongoDB stores the application-level vote record.
* The blockchain stores the cryptographic vote hash.
* The transaction hash provides a blockchain transaction reference.
* The blockchain verification endpoint confirms the stored vote hash.

8. Demo Flow

Admin Login
↓
Create Election
↓
Activate Election
↓
Add Candidates
↓
Voter Login
↓
Open Election
↓
Select Candidate
↓
Confirm Vote
↓
Blockchain Transaction
↓
MongoDB Vote Record
↓
Blockchain Verification
↓
verified: true

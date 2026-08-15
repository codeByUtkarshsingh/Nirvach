# NIRVACH

## Secure Blockchain-Enabled Digital Voting Platform

Nirvach is a secure digital voting platform designed to provide a transparent, authenticated and tamper-resistant election experience.

The system combines:

- React + Vite frontend
- Node.js + Express backend
- MongoDB database
- JWT authentication
- bcrypt password hashing
- Role-based access control
- Solidity smart contract
- Blockchain vote recording
- Blockchain vote verification

---

# 1. Project Architecture

```text
Nirvach
│
├── frontend
│   └── React + Vite
│
├── backend
│   ├── Node.js + Express
│   ├── MongoDB
│   └── Blockchain integration
│
└── backend/blockchain
    └── Solidity smart contract

High-level flow

User
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ├──────────────► MongoDB
 │
 ▼
Authentication / Authorization
 │
 ▼
Election & Candidate Management
 │
 ▼
Vote Controller
 │
 ├──────────────► MongoDB Vote Record
 │
 └──────────────► Blockchain Smart Contract
                         │
                         ▼
                  Transaction Hash
                         │
                         ▼
                  Block Confirmation
                         │
                         ▼
                  Vote Verification



Technology Stack

Frontend

* React
* Vite
* React Router
* JavaScript
* CSS

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS

Blockchain

* Solidity
* Ethers.js
* Ethereum-compatible RPC
* Smart contract for vote hash recording and verification


Features

Authentication

* Voter registration
* Admin registration
* Login
* JWT authentication
* Password hashing with bcrypt
* Protected routes

Voter Features

* Login
* View active elections
* View candidates
* Cast a vote
* Verify the blockchain record of a vote

Admin Features

* Login
* Create elections
* Activate elections
* Create candidates
* Manage voter eligibility

⸻

Voting Security

Nirvach implements multiple security layers.

Authentication

Users must authenticate before accessing protected resources.

Authorization

Administrative operations require an authenticated user with the admin role.

Eligibility

Only eligible voters can cast votes.

Duplicate Vote Prevention

MongoDB maintains a unique constraint on:
  
     voter + election

This prevents a voter from voting twice in the same election.

Blockchain Recording

A cryptographic vote hash is recorded on the blockchain.

Blockchain Verification

The stored vote hash can later be checked against the smart contract.

⸻

Blockchain Smart Contract

The smart contract is located at: backend/blockchain/Voting.sol


The contract provides: recordVote(bytes32 _voteHash)
and: verifyVote(bytes32 _voteHash)

The contract stores:

* Vote hash
* Blockchain timestamp

The backend stores:

* Transaction hash
* Block number
* Contract address




/*BACKEND STRUCTURE*/

backend/
│
├── blockchain/
│   ├── Voting.sol
│   ├── VotingABI.json
│   ├── VotingBytecode.json
│   ├── compile.js
│   ├── deploy.js
│   └── deployment.json
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   ├── electionController.js
│   │   ├── userController.js
│   │   └── voteController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Election.js
│   │   ├── Candidate.js
│   │   └── Vote.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── electionRoutes.js
│   │   ├── candidateRoutes.js
│   │   └── voteRoutes.js
│   │
│   ├── services/
│   │   └── blockchainService.js
│   │
│   ├── utils/
│   │   └── makeAdmin.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── package.json
└── package-lock.json


Frontend Structure:


frontend/
│
├── public/
│
├── src/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ElectionDetails.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── package-lock.json


Environment Variables

The backend requires:PORT
MONGODB_URI
JWT_SECRET
BLOCKCHAIN_RPC_URL
BLOCKCHAIN_PRIVATE_KEY
BLOCKCHAIN_CONTRACT_ADDRESS
ADMIN_REGISTRATION_KEY

The actual enviornment file is:backend/.env

The safe template is:backend/.env.example

Important

Never commit:backend/.env

nstallation

Clone the repository:git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Nirvach

backend 
cd backend
npm install

Create:backend/.env
using backend/.env.example as a template.

Then start the backend:node src/server.js

Expected:Nirvach server running on http://localhost:3000

Frontend

Open another terminal:cd frontend
npm install
npm run dev

The frontend normally runs at:http://localhost:5173

API Overview

Authentication

Register voter:POST /api/auth/register

Register admin:POST /api/auth/register-admin

Login: POST /api/auth/login

Elections

Get active elections:GET /api/elections
Create election:POST /api/elections/create
Activate election:POST /api/elections/activate/:id

POST /api/elections/activate/:iUser
 │
 ▼
React Frontend
 │
 ▼
Express REST API
 │
 ├──────────────► MongoDB
 │
 ▼
Authentication / Authorization
 │
 ▼
Election & Candidate Management
 │
 ▼
Vote Controller
 │
 ├──────────────► MongoDB Vote Record
 │
 └──────────────► Blockchain Smart Contract
                         │
                         ▼
                  Transaction Hash
                         │
                         ▼
                  Block Confirmation
                         │
                         ▼
                  Vote Verification


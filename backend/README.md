# NexTerra Orbit Backend

Production-ready Node.js backend for the hackathon site.

## Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT authentication
- bcrypt
- dotenv
- cors
- express-validator
- Helmet
- Morgan
- rate limiting

## Setup

1. Create a MongoDB database.
2. Update `.env` with your values.
3. Install dependencies inside `backend/`.
4. Seed the admin account.
5. Start the server.

```bash
cd backend
npm install
npm run seed:admin
npm run dev
```

## Environment Variables

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`
- `MAX_TEAM_SIZE`
- `IDEA_PITCH_MAX_LENGTH`

## Authentication

Admins log in with `POST /api/admin/login` and receive a JWT.

Send the token in the `Authorization` header for protected routes:

```http
Authorization: Bearer <token>
```

## API Summary

### Public

- `POST /api/register`
- `GET /api/results/round1`
- `GET /api/results/round2`
- `GET /api/results/winners`

### Protected Admin

- `GET /api/teams`
- `GET /api/team/:id`
- `PATCH /api/team/:id/status`
- `DELETE /api/team/:id`
- `GET /api/admin/dashboard`

## Sample Requests

### Admin Login

```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@nexterra.dev",
  "password": "ChangeMe123!"
}
```

### Register Team

```http
POST /api/register
Content-Type: application/json

{
  "teamName": "Terra Titans",
  "collegeName": "ABC Engineering College",
  "track": "Web",
  "teamSize": 3,
  "ideaPitch": "A smart campus navigation platform.",
  "leader": {
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "+919876543210",
    "branch": "CSE",
    "year": "3",
    "gender": "male"
  },
  "members": [
    {
      "name": "Neha Singh",
      "email": "neha@example.com",
      "phone": "+919876543211",
      "branch": "CSE",
      "year": "3",
      "gender": "female"
    },
    {
      "name": "Rohit Verma",
      "email": "rohit@example.com",
      "phone": "+919876543212",
      "branch": "IT",
      "year": "2",
      "gender": "male"
    }
  ]
}
```

### Update Status

```http
PATCH /api/team/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "round1"
}
```

## Socket.IO Event

When an admin updates a team's status, the server emits:

```json
{
  "teamId": "...",
  "teamName": "Terra Titans",
  "status": "round1"
}
```

Event name: `statusUpdated`

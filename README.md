# AmarToLet Website

A modern rental property marketplace platform built with React, Node.js, and MongoDB.

## Features

- ✨ User authentication (Login/Sign up)
- 🏠 Property listings with detailed information
- 🔍 Advanced search and filtering
- 📍 Google Maps integration
- ⭐ Reviews and ratings system
- 💬 Real-time chat system
- 🗓️ Booking/visit scheduling
- 📋 Property verification badges
- 🌙 Dark/Light mode
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Zustand (State Management)

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io (Real-time chat)
- JWT Authentication

## Project Structure

```
.
├── client/           # React frontend
├── server/           # Express backend
└── package.json      # Root package.json
```

## Installation

1. Install dependencies in root:
```bash
npm install
```

2. Install individual dependencies:
```bash
# Frontend
cd client && npm install

# Backend
cd server && npm install
```

## Development

Run both frontend and backend:
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1: Frontend
cd client && npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Refer to individual README files in `client/` and `server/` directories.

## License

MIT

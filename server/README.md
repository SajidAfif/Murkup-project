# To-LET Website - Backend

## Environment Variables

Create a `.env` file in the server directory:

```
MONGODB_URI=mongodb://localhost:27017/tolet
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

## Running the Server

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Start production
npm start
```

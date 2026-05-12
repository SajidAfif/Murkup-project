# To-LET Website - Frontend

## Environment Variables

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Running the Client

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/hooks/` - Custom React hooks
- `src/services/` - API services
- `src/context/` - React context for global state
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

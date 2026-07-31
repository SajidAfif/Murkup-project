# To-LET Website - Frontend

## Environment Variables

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Google Maps is optional. When `VITE_GOOGLE_MAPS_API_KEY` is a real browser key, the site uses Google Maps and Google Places search. Without a key, the site automatically uses OpenStreetMap with address search and clickable location selection, so posting and viewing properties still work. To use Google specifically, enable billing plus **Maps JavaScript API** and **Places API** in Google Cloud, restrict the key by HTTP referrer such as `http://localhost:5173/*`, and restart the Vite client.

Owners can search or click to select a property location while posting. The selected latitude and longitude are saved with the property and displayed to tenants on the property details page.

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

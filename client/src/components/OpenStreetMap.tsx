import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface OpenStreetMapProps {
  initialLat?: number
  initialLng?: number
  address?: string
  city?: string
  interactive?: boolean
  onLocationSelect?: (lat: number, lng: number) => void
}

const defaultCenter: [number, number] = [23.8103, 90.4125]

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (event) => onLocationSelect(event.latlng.lat, event.latlng.lng),
  })
  return null
}

function MapRecenter({ position }: { position: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, 15)
  }, [map, position])

  return null
}

export default function OpenStreetMap({
  initialLat,
  initialLng,
  address = '',
  city = '',
  interactive = false,
  onLocationSelect,
}: OpenStreetMapProps) {
  const hasInitialPosition = typeof initialLat === 'number' && typeof initialLng === 'number' &&
    (initialLat !== 0 || initialLng !== 0)
  const [position, setPosition] = useState<[number, number]>(
    hasInitialPosition ? [initialLat!, initialLng!] : defaultCenter
  )
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const selectLocation = (lat: number, lng: number) => {
    setPosition([lat, lng])
    onLocationSelect?.(lat, lng)
  }

  const searchLocation = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!search.trim()) return

    setSearching(true)
    setSearchError('')
    try {
      const query = encodeURIComponent(search.trim())
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`)
      const results = await response.json()
      if (!results[0]) {
        setSearchError('Location not found. Try a nearby landmark or area.')
        return
      }
      selectLocation(Number(results[0].lat), Number(results[0].lon))
    } catch {
      setSearchError('Location search is temporarily unavailable. Click the map to choose a point.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-2">
      {interactive && (
        <form onSubmit={searchLocation} className="flex gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search address, area, or landmark"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <button type="submit" disabled={searching} className="rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>
      )}
      {searchError && <p className="text-sm text-red-600 dark:text-red-400">{searchError}</p>}
      <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
        <MapContainer center={position} zoom={hasInitialPosition ? 15 : 11} scrollWheelZoom style={{ height: 300, width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {interactive && onLocationSelect && <MapClickHandler onLocationSelect={selectLocation} />}
          <MapRecenter position={position} />
          <CircleMarker center={position} radius={10} pathOptions={{ color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.85 }} />
        </MapContainer>
      </div>
      {interactive && <p className="text-sm text-gray-500">Search for the address or click the map to place the property pin.</p>}
      {!interactive && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm font-semibold text-primary-600 underline dark:text-primary-400"
        >
          Open this location in Google Maps
        </a>
      )}
      {address && city && <span className="sr-only">{address}, {city}</span>}
    </div>
  )
}
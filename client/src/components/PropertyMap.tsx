import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import OpenStreetMap from './OpenStreetMap'

interface PropertyMapProps {
  address: string
  city: string
  latitude: number
  longitude: number
}

const containerStyle = {
  width: '100%',
  height: '320px',
}

export default function PropertyMap({ address, city, latitude, longitude }: PropertyMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  const hasApiKey = apiKey.length > 0 && !apiKey.startsWith('your_')
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude) &&
    (latitude !== 0 || longitude !== 0)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  })

  if (!hasCoordinates) return null

  if (!hasApiKey) {
    return (
      <OpenStreetMap
        initialLat={latitude}
        initialLng={longitude}
        address={address}
        city={city}
      />
    )
  }

  if (!isLoaded) {
    return <div className="h-[320px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
  }

  const position = { lat: latitude, lng: longitude }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={15}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
      >
        <Marker position={position} title={`${address}, ${city}`} />
      </GoogleMap>
    </div>
  )
}
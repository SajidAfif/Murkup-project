import { useState, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api'

type Libraries = "places"[];
const libraries: Libraries = ["places"];

interface MapPickerProps {
  initialLat?: number
  initialLng?: number
  onLocationSelect: (lat: number, lng: number) => void
}

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
}

// Default center: Dhaka, Bangladesh
const defaultCenter = {
  lat: 23.8103,
  lng: 90.4125
}

export default function MapPicker({ initialLat, initialLng, onLocationSelect }: MapPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const [marker, setMarker] = useState<{ lat: number, lng: number } | null>(
    initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null
  )

  const onClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setMarker({ lat, lng })
      onLocationSelect(lat, lng)
    }
  }, [onLocationSelect])

  const onLoadAutocomplete = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete
  }

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace()
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setMarker({ lat, lng })
        onLocationSelect(lat, lng)
      }
    }
  }

  if (!isLoaded) {
    return <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg animate-pulse">Loading Map...</div>
  }

  return (
    <div className="space-y-2">
      <Autocomplete
        onLoad={onLoadAutocomplete}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          placeholder="Search for a location (e.g. Gulshan, Dhaka)"
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-primary-500"
          onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
        />
      </Autocomplete>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden relative">
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || defaultCenter}
        zoom={marker ? 15 : 11}
        onClick={onClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {marker && (
          <Marker position={marker} />
        )}
      </GoogleMap>
      </div>
    </div>
  )
}

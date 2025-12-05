import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import './LocationPicker.css'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationPicker({ location, onChange }) {
  const [address, setAddress] = useState(location?.address || '')
  const [mapCenter, setMapCenter] = useState(
    location ? [location.lat, location.lng] : [12.9716, 77.5946]
  )

  useEffect(() => {
    if (location) {
      setMapCenter([location.lat, location.lng])
      setAddress(location.address || '')
    }
  }, [location])

  const handleLocationSelect = (lat, lng) => {
    const newLocation = { lat, lng, address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}` }
    onChange(newLocation)
    reverseGeocode(lat, lng)
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleLocationSelect(latitude, longitude)
        },
        (error) => {
          alert('Unable to get your location. Please select on the map.')
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'CivicIssuePlatform/1.0',
          },
        }
      )
      const data = await response.json()
      if (data.display_name) {
        setAddress(data.display_name)
        onChange({ lat, lng, address: data.display_name })
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error)
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    }
  }

  return (
    <div className="location-picker">
      <div className="location-controls">
        <input
          type="text"
          className="location-input"
          placeholder="Address (auto-filled from map)"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value)
            if (location) {
              onChange({ ...location, address: e.target.value })
            }
          }}
        />
        <button
          type="button"
          className="location-button"
          onClick={handleUseCurrentLocation}
        >
          📍 Use My Location
        </button>
      </div>
      <div className="location-map">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '400px', width: '100%', borderRadius: 'var(--radius-md)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {location && (
            <Marker position={[location.lat, location.lng]} />
          )}
          <MapClickHandler onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
    </div>
  )
}


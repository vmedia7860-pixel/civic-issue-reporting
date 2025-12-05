import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Link } from 'react-router-dom'
import { useReports } from '../hooks/useReports'
import './MapView.css'

delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapController({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

const statusColors = {
  New: '#3b82f6',
  Triaged: '#f59e0b',
  'In Progress': '#14b8a6',
  Resolved: '#10b981',
  Closed: '#6b7280',
}

export default function MapView() {
  const { reports } = useReports()
  const [selectedReport, setSelectedReport] = useState(null)
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Use default center if geolocation fails
        }
      )
    }
  }, [])

  const reportsWithLocation = reports.filter((r) => r.location?.lat && r.location?.lng)

  return (
    <motion.main
      className="map-view-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1>Issue Map</h1>
        <p>View all reported issues on the map</p>
      </div>

      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)' }}
        >
          <MapController center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reportsWithLocation.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              eventHandlers={{
                click: () => setSelectedReport(report),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h3>{report.title}</h3>
                  <p className="map-popup-status" style={{ color: statusColors[report.status] }}>
                    {report.status}
                  </p>
                  <p className="map-popup-category">{report.category}</p>
                  <Link to={`/reports/${report.id}`}>
                    <button className="map-popup-link">View Details →</button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="map-legend">
        <h3>Legend</h3>
        <div className="legend-items">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: color }} />
              <span>{status}</span>
            </div>
          ))}
        </div>
        <div className="map-stats">
          <p>Total Reports: {reportsWithLocation.length}</p>
        </div>
      </div>
    </motion.main>
  )
}


import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './ReportCard.css'

const statusColors = {
  New: '#3b82f6',
  Triaged: '#f59e0b',
  'In Progress': '#14b8a6',
  Resolved: '#10b981',
  Closed: '#6b7280',
}

export default function ReportCard({ report }) {
  const statusColor = statusColors[report.status] || statusColors.New

  return (
    <motion.div
      className="report-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link to={`/reports/${report.id}`} className="report-card-link">
        <div className="report-card-header">
          <h3 className="report-card-title">{report.title}</h3>
          <span
            className="report-card-status"
            style={{ '--status-color': statusColor }}
          >
            {report.status}
          </span>
        </div>
        <p className="report-card-description">{report.description}</p>
        <div className="report-card-meta">
          <span className="report-card-category">{report.category}</span>
          <span className="report-card-priority">Priority: {report.priority}/10</span>
          {report.location?.address && (
            <span className="report-card-location">📍 {report.location.address}</span>
          )}
        </div>
        {report.media && report.media.length > 0 && (
          <div className="report-card-media">
            {report.media.slice(0, 3).map((item, idx) => (
              <div key={idx} className="report-card-media-item">
                {item.type === 'image' ? (
                  <img src={item.thumb || item.url} alt={`Media ${idx + 1}`} />
                ) : (
                  <div className="video-placeholder">🎥</div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="report-card-footer">
          <span className="report-card-date">
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
          {report.assignedTo && (
            <span className="report-card-assigned">Assigned to: {report.assignedTo}</span>
          )}
        </div>
      </Link>
    </motion.div>
  )
}


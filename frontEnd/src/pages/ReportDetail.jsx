import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReports } from '../hooks/useReports'
import { useEffect, useState } from 'react'
import Button from '../components/common/Button'
import './ReportDetail.css'

export default function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getReport, loading } = useReports()
  const [report, setReport] = useState(null)

  useEffect(() => {
    const reportData = getReport(id)
    setReport(reportData)
  }, [id, getReport])

  if (loading || !report) {
    return (
      <main className="report-detail-page">
        <div className="loading">Loading report...</div>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="report-detail-page">
        <div className="error-state">
          <h2>Report not found</h2>
          <Button onClick={() => navigate('/reports')}>Back to Reports</Button>
        </div>
      </main>
    )
  }

  return (
    <motion.main
      className="report-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="report-detail-header">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <h1>{report.title}</h1>
        <div className="report-detail-meta">
          <span className={`status-badge status-${report.status.toLowerCase().replace(' ', '-')}`}>
            {report.status}
          </span>
          <span className="category-badge">{report.category}</span>
          <span className="priority-badge">Priority: {report.priority}/10</span>
        </div>
      </div>

      <div className="report-detail-content">
        <div className="report-detail-main">
          <section className="report-section">
            <h2>Description</h2>
            <p>{report.description}</p>
          </section>

          {report.media && report.media.length > 0 && (
            <section className="report-section">
              <h2>Media</h2>
              <div className="media-gallery">
                {report.media.map((item, idx) => (
                  <div key={idx} className="media-item">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={`Media ${idx + 1}`} />
                    ) : (
                      <video src={item.url} controls />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {report.location && (
            <section className="report-section">
              <h2>Location</h2>
              <p className="location-text">📍 {report.location.address}</p>
              <div className="location-map">
                <iframe
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.location.lng - 0.01},${report.location.lat - 0.01},${report.location.lng + 0.01},${report.location.lat + 0.01}&layer=mapnik&marker=${report.location.lat},${report.location.lng}`}
                />
              </div>
            </section>
          )}
        </div>

        <div className="report-detail-sidebar">
          <section className="report-section">
            <h2>Report Information</h2>
            <div className="info-item">
              <span className="info-label">Report ID:</span>
              <span className="info-value">{report.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created:</span>
              <span className="info-value">
                {new Date(report.createdAt).toLocaleString()}
              </span>
            </div>
            {report.updatedAt && (
              <div className="info-item">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">
                  {new Date(report.updatedAt).toLocaleString()}
                </span>
              </div>
            )}
            {report.assignedTo && (
              <div className="info-item">
                <span className="info-label">Assigned To:</span>
                <span className="info-value">{report.assignedTo}</span>
              </div>
            )}
            <div className="info-item">
              <span className="info-label">Reporter:</span>
              <span className="info-value">{report.reporter?.name || 'Anonymous'}</span>
            </div>
          </section>

          {report.timeline && report.timeline.length > 0 && (
            <section className="report-section">
              <h2>Timeline</h2>
              <div className="timeline">
                {report.timeline.map((event, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <p className="timeline-note">{event.note}</p>
                      <span className="timeline-actor">{event.actor}</span>
                      <span className="timeline-date">
                        {new Date(event.ts).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.main>
  )
}


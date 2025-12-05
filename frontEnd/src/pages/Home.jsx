import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/common/Button'
import { useReports } from '../hooks/useReports'
import ReportCard from '../components/report/ReportCard'
import './Home.css'

export default function Home() {
  const { reports } = useReports()
  const recentReports = reports.slice(0, 3)

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Report Civic Issues
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Help make your community better by reporting issues like potholes, broken
            streetlights, water leaks, and more.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/create">
              <Button variant="primary" size="lg">
                Report an Issue
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="lg">
                View Map
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="feature-icon">📝</div>
            <h3>Report</h3>
            <p>Describe the issue, add photos, and mark the location on the map.</p>
          </motion.div>
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="feature-icon">🤖</div>
            <h3>AI Assistance</h3>
            <p>Get automatic suggestions for category and priority using AI.</p>
          </motion.div>
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-icon">📊</div>
            <h3>Track</h3>
            <p>Monitor the status of your reports and see updates in real-time.</p>
          </motion.div>
        </div>
      </section>

      {recentReports.length > 0 && (
        <section className="recent-reports">
          <h2>Recent Reports</h2>
          <div className="reports-grid">
            {recentReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
          <div className="recent-reports-footer">
            <Link to="/reports">
              <Button variant="outline">View All Reports</Button>
            </Link>
          </div>
        </section>
      )}
    </motion.div>
  )
}


import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useReports } from '../hooks/useReports'
import ReportCard from '../components/report/ReportCard'
import Input from '../components/common/Input'
import './MyReports.css'

export default function MyReports() {
  const { reports, loading } = useReports()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        search === '' ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || report.status === filterStatus
      const matchesCategory = filterCategory === 'all' || report.category === filterCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [reports, search, filterStatus, filterCategory])

  const statusCounts = useMemo(() => {
    const counts = {}
    reports.forEach((report) => {
      counts[report.status] = (counts[report.status] || 0) + 1
    })
    return counts
  }, [reports])

  if (loading) {
    return (
      <main className="my-reports-page">
        <div className="loading">Loading reports...</div>
      </main>
    )
  }

  return (
    <motion.main
      className="my-reports-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1>My Reports</h1>
        <p>Track and manage all your reported issues</p>
      </div>

      <div className="reports-filters">
        <Input
          type="text"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All ({reports.length})</option>
            {Object.entries(statusCounts).map(([status, count]) => (
              <option key={status} value={status}>
                {status} ({count})
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Category:</label>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Road">Road</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Waste">Waste</option>
            <option value="Traffic">Traffic</option>
            <option value="Parks">Parks</option>
            <option value="Emergency">Emergency</option>
            <option value="General">General</option>
          </select>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <p>No reports found. {reports.length === 0 && 'Create your first report!'}</p>
        </div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </motion.main>
  )
}


import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useReports } from '../hooks/useReports'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import ReportCard from '../components/report/ReportCard'
import './AdminDashboard.css'

const STATUSES = ['New', 'Triaged', 'In Progress', 'Resolved', 'Closed']

export default function AdminDashboard() {
  const { reports, updateReport, loading } = useReports()
  const { showToast } = useToast()
  const [selectedReport, setSelectedReport] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [statusUpdate, setStatusUpdate] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [note, setNote] = useState('')

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

  const stats = useMemo(() => {
    const stats = {
      total: reports.length,
      new: 0,
      inProgress: 0,
      resolved: 0,
      avgPriority: 0,
    }
    let totalPriority = 0
    reports.forEach((report) => {
      if (report.status === 'New') stats.new++
      if (report.status === 'In Progress') stats.inProgress++
      if (report.status === 'Resolved') stats.resolved++
      totalPriority += report.priority || 0
    })
    stats.avgPriority = reports.length > 0 ? (totalPriority / reports.length).toFixed(1) : 0
    return stats
  }, [reports])

  const handleOpenModal = (report) => {
    setSelectedReport(report)
    setStatusUpdate(report.status)
    setAssignedTo(report.assignedTo || '')
    setNote('')
    setIsModalOpen(true)
  }

  const handleUpdateReport = async () => {
    if (!selectedReport) return

    try {
      const updates = {}
      if (statusUpdate !== selectedReport.status) {
        updates.status = statusUpdate
      }
      if (assignedTo !== (selectedReport.assignedTo || '')) {
        updates.assignedTo = assignedTo || null
      }

      await updateReport(selectedReport.id, {
        ...updates,
        ...(note && {
          timeline: [
            ...(selectedReport.timeline || []),
            {
              ts: new Date().toISOString(),
              actor: 'admin',
              note: note,
            },
          ],
        }),
      })

      showToast('Report updated successfully', 'success')
      setIsModalOpen(false)
      setSelectedReport(null)
    } catch (error) {
      showToast('Failed to update report', 'error')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <main className="admin-dashboard">
        <div className="loading">Loading dashboard...</div>
      </main>
    )
  }

  return (
    <motion.main
      className="admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and track all reported issues</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.new}</div>
          <div className="stat-label">New</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.avgPriority}</div>
          <div className="stat-label">Avg Priority</div>
        </div>
      </div>

      <div className="admin-filters">
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
            <option value="all">All</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
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
        <div className="empty-state">No reports found</div>
      ) : (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div key={report.id} className="admin-report-card">
              <ReportCard report={report} />
              <div className="admin-actions">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenModal(report)}
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Manage Report: ${selectedReport?.id}`}
        size="md"
      >
        {selectedReport && (
          <div className="admin-modal-content">
            <div className="form-group">
              <label className="input-label">Status</label>
              <select
                className="input"
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="input-label">Assign To</label>
              <input
                type="text"
                className="input"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Team or person name"
              />
            </div>
            <div className="form-group">
              <label className="input-label">Add Note</label>
              <textarea
                className="input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an update note..."
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateReport}>
                Update Report
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.main>
  )
}


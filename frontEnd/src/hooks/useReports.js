import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'civic_reports'

export function useReports() {
  const [reports, setReports] = useLocalStorage(STORAGE_KEY, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load reports from API on mount
  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/reports')
      if (!response.ok) throw new Error('Failed to load reports')
      const data = await response.json()
      setReports(data)
    } catch (err) {
      console.error('Failed to load reports:', err)
      setError(err.message)
      // Fallback to localStorage if API fails
    } finally {
      setLoading(false)
    }
  }

  const createReport = async (reportData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      })
      if (!response.ok) throw new Error('Failed to create report')
      const newReport = await response.json()
      setReports((prev) => [...prev, newReport])
      return newReport
    } catch (err) {
      console.error('Failed to create report:', err)
      setError(err.message)
      // Fallback: create locally
      const newReport = {
        ...reportData,
        id: `RPT_${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setReports((prev) => [...prev, newReport])
      return newReport
    } finally {
      setLoading(false)
    }
  }

  const updateReport = async (id, updates) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update report')
      const updatedReport = await response.json()
      setReports((prev) =>
        prev.map((r) => (r.id === id ? updatedReport : r))
      )
      return updatedReport
    } catch (err) {
      console.error('Failed to update report:', err)
      setError(err.message)
      // Fallback: update locally
      setReports((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                ...updates,
                timeline: [
                  ...(r.timeline || []),
                  {
                    ts: new Date().toISOString(),
                    actor: 'system',
                    note: updates.status
                      ? `Status changed to ${updates.status}`
                      : 'Report updated',
                  },
                ],
              }
            : r
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const getReport = useCallback(
    (id) => reports.find((r) => r.id === id),
    [reports]
  )

  return {
    reports,
    loading,
    error,
    createReport,
    updateReport,
    getReport,
    loadReports,
  }
}


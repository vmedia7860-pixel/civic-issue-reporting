import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Input from '../common/Input'
import Button from '../common/Button'
import MediaUploader from './MediaUploader'
import LocationPicker from './LocationPicker'
import { useAI } from '../../hooks/useAI'
import { useReports } from '../../hooks/useReports'
import { useToast } from '../common/Toast'
import './ReportForm.css'

export default function ReportForm({ reportId, initialData }) {
  const navigate = useNavigate()
  const { createReport, updateReport } = useReports()
  const { showToast } = useToast()
  const { getAIPredictions, loading: aiLoading } = useAI()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    priority: initialData?.priority || 3,
    location: initialData?.location || null,
    media: initialData?.media || [],
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiSuggestions, setAISuggestions] = useState(null)

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleGetSuggestions = async () => {
    if (!formData.description.trim()) {
      showToast('Please enter a description first', 'warning')
      return
    }

    setShowAISuggestions(true)
    const suggestions = await getAIPredictions(formData.description)
    setAISuggestions(suggestions)

    // Auto-apply suggestions
    if (suggestions.title) handleChange('title', suggestions.title)
    if (suggestions.category) handleChange('category', suggestions.category)
    if (suggestions.priority) handleChange('priority', suggestions.priority)
  }

  const handleApplySuggestion = (field, value) => {
    handleChange(field, value)
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.location) newErrors.location = 'Please select a location'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    setSubmitting(true)
    try {
      const reportData = {
        ...formData,
        reporter: {
          id: 'anon',
          name: 'Anonymous',
        },
        status: 'New',
      }

      if (reportId) {
        await updateReport(reportId, reportData)
        showToast('Report updated successfully', 'success')
      } else {
        const newReport = await createReport(reportData)
        showToast('Report submitted successfully', 'success')
        navigate(`/reports/${newReport.id}`)
      }
    } catch (error) {
      showToast('Failed to submit report', 'error')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      className="report-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="form-section">
        <h2>Report Details</h2>
        <Input
          label="Title *"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          placeholder="Brief title for your report"
        />
        <Input
          label="Description *"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          placeholder="Describe the issue in detail..."
          as="textarea"
          rows={5}
        />
        <div className="ai-suggestions-section">
          <Button
            type="button"
            variant="outline"
            onClick={handleGetSuggestions}
            disabled={aiLoading || !formData.description.trim()}
          >
            {aiLoading ? 'Getting suggestions...' : '🤖 Get AI Suggestions'}
          </Button>
          {showAISuggestions && aiSuggestions && (
            <motion.div
              className="ai-suggestions"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h3>AI Suggestions</h3>
              {aiSuggestions.title && (
                <div className="suggestion-item">
                  <span className="suggestion-label">Title:</span>
                  <span className="suggestion-value">{aiSuggestions.title}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApplySuggestion('title', aiSuggestions.title)}
                  >
                    Apply
                  </Button>
                </div>
              )}
              {aiSuggestions.category && (
                <div className="suggestion-item">
                  <span className="suggestion-label">Category:</span>
                  <span className="suggestion-value">{aiSuggestions.category}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApplySuggestion('category', aiSuggestions.category)}
                  >
                    Apply
                  </Button>
                </div>
              )}
              {aiSuggestions.priority && (
                <div className="suggestion-item">
                  <span className="suggestion-label">Priority:</span>
                  <span className="suggestion-value">{aiSuggestions.priority}/10</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleApplySuggestion('priority', aiSuggestions.priority)}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2>Category & Priority</h2>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">Category</label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">Select category</option>
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
          <div className="form-group">
            <label className="input-label">Priority (1-10)</label>
            <input
              type="number"
              className="input"
              min="1"
              max="10"
              value={formData.priority}
              onChange={(e) => handleChange('priority', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Media</h2>
        <MediaUploader
          media={formData.media}
          onChange={(media) => handleChange('media', media)}
        />
      </div>

      <div className="form-section">
        <h2>Location *</h2>
        {errors.location && <div className="error-text">{errors.location}</div>}
        <LocationPicker
          location={formData.location}
          onChange={(location) => handleChange('location', location)}
        />
      </div>

      <div className="form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Submitting...' : reportId ? 'Update Report' : 'Submit Report'}
        </Button>
      </div>
    </motion.form>
  )
}


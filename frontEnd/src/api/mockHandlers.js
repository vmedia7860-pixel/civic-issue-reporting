import { http, HttpResponse } from 'msw'
import { dummyClassifier } from '../utils/dummyClassifier'
import demoData from '../data/demo-data.json'

let reports = [...demoData]

export const handlers = [
  // Get all reports
  http.get('/api/reports', () => {
    return HttpResponse.json(reports)
  }),

  // Get single report
  http.get('/api/reports/:id', ({ params }) => {
    const report = reports.find((r) => r.id === params.id)
    if (!report) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(report)
  }),

  // Create report
  http.post('/api/reports', async ({ request }) => {
    const data = await request.json()
    const newReport = {
      ...data,
      id: `RPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: data.status || 'New',
      timeline: [
        {
          ts: new Date().toISOString(),
          actor: 'system',
          note: 'Report created',
        },
      ],
    }
    reports.push(newReport)
    return HttpResponse.json(newReport, { status: 201 })
  }),

  // Update report
  http.patch('/api/reports/:id', async ({ params, request }) => {
    const updates = await request.json()
    const index = reports.findIndex((r) => r.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    
    const updatedReport = {
      ...reports[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      timeline: [
        ...(reports[index].timeline || []),
        {
          ts: new Date().toISOString(),
          actor: updates.assignedTo || 'admin',
          note: updates.status
            ? `Status changed to ${updates.status}`
            : 'Report updated',
        },
      ],
    }
    reports[index] = updatedReport
    return HttpResponse.json(updatedReport)
  }),

  // Delete report
  http.delete('/api/reports/:id', ({ params }) => {
    const index = reports.findIndex((r) => r.id === params.id)
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    reports.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // AI predictions
  http.post('/api/ai/predict', async ({ request }) => {
    const { text } = await request.json()
    
    // Simulate AI delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const SIMULATE_AI = import.meta.env.VITE_SIMULATE_AI === 'true'
    
    if (SIMULATE_AI) {
      // Simulate OpenAI-like response
      const fallback = dummyClassifier(text)
      return HttpResponse.json({
        title: fallback.title,
        category: fallback.category,
        priority: fallback.priority,
        reasoning: `Based on keywords in the description, this appears to be a ${fallback.category} issue with priority ${fallback.priority}.`,
      })
    }
    
    // If real OpenAI key exists, you would call it here
    // For now, return fallback
    const fallback = dummyClassifier(text)
    return HttpResponse.json(fallback)
  }),
]


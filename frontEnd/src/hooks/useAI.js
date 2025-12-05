import { useState } from 'react'
import { dummyClassifier } from '../utils/dummyClassifier'

const SIMULATE_AI = "" === 'true'
const OPENAI_API_KEY = ''

export function useAI() {
  const [loading, setLoading] = useState(false)

  const getAIPredictions = async (description) => {
    if (!description || description.trim().length === 0) {
      return dummyClassifier(description)
    }

    setLoading(true)
    
    try {
      // Check if we should use AI
      if (!SIMULATE_AI && !OPENAI_API_KEY) {
        return dummyClassifier(description)
      }

      // Try to call AI endpoint
      const response = await fetch('/api/ai/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: description }),
      })

      if (!response.ok) {
        throw new Error('AI service unavailable')
      }

      const data = await response.json()
      setLoading(false)
      return data
    } catch (error) {
      console.warn('AI service failed, using fallback:', error)
      setLoading(false)
      return dummyClassifier(description)
    }
  }

  return { getAIPredictions, loading }
}


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Initialize MSW in development
async function enableMocking() {
  // if (import.meta.env.MODE !== 'development') {
  //   return
  // }

  try {
    const { worker } = await import('./api/mockServiceWorker')
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  } catch (error) {
    console.warn('MSW initialization failed:', error)
    return Promise.resolve()
  }
}

enableMocking()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  })
  .catch((error) => {
    console.error('Failed to start app:', error)
    // Render app anyway even if MSW fails
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  })

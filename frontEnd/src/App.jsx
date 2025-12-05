import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import CreateReport from './pages/CreateReport'
import MyReports from './pages/MyReports'
import ReportDetail from './pages/ReportDetail'
import AdminDashboard from './pages/AdminDashboard'
import MapView from './pages/MapView'
import Header from './components/common/Header'
import { ToastProvider } from './components/common/Toast'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app">
          <Header />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateReport />} />
              <Route path="/reports" element={<MyReports />} />
              <Route path="/reports/:id" element={<ReportDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/map" element={<MapView />} />
            </Routes>
          </AnimatePresence>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App


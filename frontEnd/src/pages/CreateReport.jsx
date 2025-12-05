import { motion } from 'framer-motion'
import ReportForm from '../components/report/ReportForm'
import './CreateReport.css'

export default function CreateReport() {
  return (
    <motion.main
      className="create-report-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1>Report a New Issue</h1>
        <p>Help us improve your community by reporting civic issues</p>
      </div>
      <ReportForm />
    </motion.main>
  )
}


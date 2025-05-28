import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-soft"
        >
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <Link
          to="/"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
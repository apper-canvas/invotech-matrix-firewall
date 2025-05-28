import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-surface-200/50 dark:border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft">
                <ApperIcon name="Receipt" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gradient">InvoTech</h1>
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors duration-200"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 text-surface-700 dark:text-surface-300" 
              />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-100 mb-4">
            Professional Invoicing for{' '}
            <span className="text-gradient">IT Services</span>
          </h2>
          <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl">
            Streamline your billing process with our comprehensive invoicing platform designed specifically for IT service companies.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: 'Total Invoices', value: '247', icon: 'FileText', color: 'primary' },
            { label: 'Pending Payment', value: '$24,580', icon: 'Clock', color: 'warning' },
            { label: 'Paid This Month', value: '$87,240', icon: 'CheckCircle', color: 'success' },
            { label: 'Active Clients', value: '42', icon: 'Users', color: 'secondary' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="card p-6 hover:shadow-invoice transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.color === 'warning' ? 'bg-warning/10 text-warning' :
                  stat.color === 'success' ? 'bg-success/10 text-success' :
                  'bg-secondary/10 text-secondary'
                }`}>
                  <ApperIcon name={stat.icon} className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">
                {stat.value}
              </h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Feature */}
        <MainFeature />
      </main>
    </div>
  )
}

export default Home
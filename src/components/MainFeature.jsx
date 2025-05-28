import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('create')
  const [clients, setClients] = useState([
    { id: '1', companyName: 'TechCorp Solutions', email: 'billing@techcorp.com', contactPerson: 'John Smith' },
    { id: '2', companyName: 'Digital Innovations LLC', email: 'accounts@diginnovate.com', contactPerson: 'Sarah Johnson' },
    { id: '3', companyName: 'CloudFirst Systems', email: 'finance@cloudfirst.io', contactPerson: 'Mike Chen' }
  ])
  
  const [invoices, setInvoices] = useState([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      clientId: '1',
      clientName: 'TechCorp Solutions',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      total: 4250.00,
      status: 'unpaid',
      lineItems: [
        { id: '1', description: 'Network Security Audit', hours: 20, rate: 150, subtotal: 3000 },
        { id: '2', description: 'System Configuration', hours: 8, rate: 125, subtotal: 1000 }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      clientId: '2',
      clientName: 'Digital Innovations LLC',
      issueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      total: 2875.00,
      status: 'paid',
      lineItems: [
        { id: '1', description: 'Database Optimization', hours: 15, rate: 175, subtotal: 2625 }
      ]
    }
  ])

  const [currentInvoice, setCurrentInvoice] = useState({
    clientId: '',
    lineItems: [{ id: '1', description: '', hours: 0, rate: 0, subtotal: 0 }],
    paymentTerms: 'Net 30',
    taxRate: 8.5
  })

  const [newClient, setNewClient] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: ''
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Calculate invoice totals
  const calculateTotals = (lineItems, taxRate = 8.5) => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.hours * item.rate), 0)
    const taxAmount = subtotal * (taxRate / 100)
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  // Update line item
  const updateLineItem = (index, field, value) => {
    const updatedItems = [...currentInvoice.lineItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    }
    
    if (field === 'hours' || field === 'rate') {
      updatedItems[index].subtotal = updatedItems[index].hours * updatedItems[index].rate
    }
    
    setCurrentInvoice({ ...currentInvoice, lineItems: updatedItems })
  }

  // Add new line item
  const addLineItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      hours: 0,
      rate: 0,
      subtotal: 0
    }
    setCurrentInvoice({
      ...currentInvoice,
      lineItems: [...currentInvoice.lineItems, newItem]
    })
  }

  // Remove line item
  const removeLineItem = (index) => {
    if (currentInvoice.lineItems.length > 1) {
      const updatedItems = currentInvoice.lineItems.filter((_, i) => i !== index)
      setCurrentInvoice({ ...currentInvoice, lineItems: updatedItems })
    }
  }

  // Create invoice
  const createInvoice = () => {
    if (!currentInvoice.clientId) {
      toast.error('Please select a client')
      return
    }

    if (currentInvoice.lineItems.some(item => !item.description || !item.hours || !item.rate)) {
      toast.error('Please fill in all line item details')
      return
    }

    const client = clients.find(c => c.id === currentInvoice.clientId)
    const { total } = calculateTotals(currentInvoice.lineItems, currentInvoice.taxRate)
    
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: currentInvoice.clientId,
      clientName: client.companyName,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      total,
      status: 'unpaid',
      lineItems: currentInvoice.lineItems
    }

    setInvoices([newInvoice, ...invoices])
    setCurrentInvoice({
      clientId: '',
      lineItems: [{ id: '1', description: '', hours: 0, rate: 0, subtotal: 0 }],
      paymentTerms: 'Net 30',
      taxRate: 8.5
    })
    
    toast.success('Invoice created successfully!')
    setActiveTab('invoices')
  }

  // Add client
  const addClient = () => {
    if (!newClient.companyName || !newClient.email) {
      toast.error('Please fill in required fields')
      return
    }

    const client = {
      id: Date.now().toString(),
      ...newClient
    }

    setClients([...clients, client])
    setNewClient({ companyName: '', contactPerson: '', email: '', phone: '' })
    toast.success('Client added successfully!')
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Update invoice status
  const updateInvoiceStatus = (invoiceId, newStatus) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    ))
    toast.success(`Invoice marked as ${newStatus}`)
  }

  const tabs = [
    { id: 'create', label: 'Create Invoice', icon: 'Plus' },
    { id: 'invoices', label: 'Invoices', icon: 'FileText' },
    { id: 'clients', label: 'Clients', icon: 'Users' }
  ]

  const { subtotal, taxAmount, total } = calculateTotals(currentInvoice.lineItems, currentInvoice.taxRate)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card overflow-hidden"
    >
      {/* Tab Navigation */}
      <div className="border-b border-surface-200 dark:border-surface-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Create Invoice Tab */}
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  Create New Invoice
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-surface-600 dark:text-surface-400">
                    Invoice #INV-2024-{String(invoices.length + 1).padStart(3, '0')}
                  </span>
                </div>
              </div>

              {/* Client Selection */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Select Client
                    </label>
                    <select
                      value={currentInvoice.clientId}
                      onChange={(e) => setCurrentInvoice({ ...currentInvoice, clientId: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Choose a client...</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Line Items */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                        Services & Line Items
                      </label>
                      <button
                        onClick={addLineItem}
                        className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors duration-200"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4" />
                        <span className="text-sm">Add Item</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {currentInvoice.lineItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="line-item-row"
                        >
                          <div className="sm:col-span-5">
                            <input
                              type="text"
                              placeholder="Service description"
                              value={item.description}
                              onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                              className="input-field"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="number"
                              placeholder="Hours"
                              value={item.hours || ''}
                              onChange={(e) => updateLineItem(index, 'hours', parseFloat(e.target.value) || 0)}
                              className="input-field"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="number"
                              placeholder="Rate ($)"
                              value={item.rate || ''}
                              onChange={(e) => updateLineItem(index, 'rate', parseFloat(e.target.value) || 0)}
                              className="input-field"
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-center justify-between">
                            <span className="font-medium text-surface-900 dark:text-surface-100">
                              ${item.subtotal.toFixed(2)}
                            </span>
                            {currentInvoice.lineItems.length > 1 && (
                              <button
                                onClick={() => removeLineItem(index)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invoice Summary */}
                <div className="lg:col-span-1">
                  <div className="card p-6 bg-surface-50 dark:bg-surface-700/50">
                    <h4 className="font-bold text-surface-900 dark:text-surface-100 mb-4">
                      Invoice Summary
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">Subtotal:</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-600 dark:text-surface-400">Tax ({currentInvoice.taxRate}%):</span>
                        <span className="font-medium">${taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-surface-200 dark:border-surface-600 pt-3">
                        <div className="flex justify-between">
                          <span className="font-bold text-surface-900 dark:text-surface-100">Total:</span>
                          <span className="font-bold text-xl text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={currentInvoice.taxRate}
                        onChange={(e) => setCurrentInvoice({ ...currentInvoice, taxRate: parseFloat(e.target.value) || 0 })}
                        className="input-field"
                      />
                    </div>

                    <button
                      onClick={createInvoice}
                      className="btn-primary w-full mt-6"
                    >
                      Create Invoice
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  Invoice Management
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10 w-full sm:w-64"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field w-full sm:w-auto"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 hover:shadow-invoice transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                            {invoice.invoiceNumber}
                          </h4>
                          <span className={`status-badge status-${invoice.status}`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 mb-1">
                          {invoice.clientName}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                          <span>Issued: {format(invoice.issueDate, 'MMM dd, yyyy')}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>Due: {format(invoice.dueDate, 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                            ${invoice.total.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {invoice.status === 'unpaid' && (
                            <button
                              onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                              className="btn-primary text-sm px-4 py-2"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2">
                            <ApperIcon name="Download" className="w-4 h-4" />
                            <span>PDF</span>
                          </button>
                          <button className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2">
                            <ApperIcon name="Mail" className="w-4 h-4" />
                            <span>Send</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                Client Management
              </h3>

              {/* Add New Client Form */}
              <div className="card p-6 bg-surface-50 dark:bg-surface-700/50">
                <h4 className="font-bold text-surface-900 dark:text-surface-100 mb-4">
                  Add New Client
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Company Name *"
                    value={newClient.companyName}
                    onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Contact Person"
                    value={newClient.contactPerson}
                    onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button
                  onClick={addClient}
                  className="btn-primary mt-4"
                >
                  Add Client
                </button>
              </div>

              {/* Client List */}
              <div className="grid gap-4">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card p-6 hover:shadow-card transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-1">
                          {client.companyName}
                        </h4>
                        <p className="text-surface-600 dark:text-surface-400 mb-1">
                          {client.contactPerson}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
                          <span>{client.email}</span>
                          {client.phone && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span>{client.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="btn-secondary text-sm px-4 py-2 flex items-center space-x-2">
                          <ApperIcon name="Edit" className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="btn-primary text-sm px-4 py-2 flex items-center space-x-2">
                          <ApperIcon name="Plus" className="w-4 h-4" />
                          <span>New Invoice</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default MainFeature
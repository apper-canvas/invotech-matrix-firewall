import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('invotech_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('invotech_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Get users from localStorage or use default admin
      const users = JSON.parse(localStorage.getItem('invotech_users') || '[]')
      const defaultAdmin = { email: 'admin@invotech.com', password: 'admin123', name: 'Admin User' }
      
      // Check if user exists
      let foundUser = users.find(u => u.email === email && u.password === password)
      
      // If no users exist and trying to login as admin, allow it
      if (!foundUser && email === defaultAdmin.email && password === defaultAdmin.password) {
        foundUser = defaultAdmin
      }
      
      if (!foundUser) {
        throw new Error('Invalid email or password')
      }
      
      const userData = {
        id: foundUser.id || 'admin',
        email: foundUser.email,
        name: foundUser.name,
        loginTime: new Date().toISOString()
      }
      
      setUser(userData)
      localStorage.setItem('invotech_user', JSON.stringify(userData))
      toast.success(`Welcome back, ${userData.name}!`)
      return userData
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { name, email, password } = userData
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem('invotech_users') || '[]')
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        throw new Error('An account with this email already exists')
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      }
      
      // Save to localStorage
      users.push(newUser)
      localStorage.setItem('invotech_users', JSON.stringify(users))
      
      // Auto login after signup
      const loginData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        loginTime: new Date().toISOString()
      }
      
      setUser(loginData)
      localStorage.setItem('invotech_user', JSON.stringify(loginData))
      toast.success(`Welcome to InvoTech, ${name}!`)
      return loginData
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('invotech_user')
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

import axios from 'axios'

// Environment-based API URL
const getApiUrl = () => {
  // ใช้ environment variable หรือ fallback ตาม mode
  const envApiUrl = import.meta.env.VITE_API_URL
  
  if (envApiUrl) {
    return envApiUrl
  }
  
  // Fallback based on mode
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:8080'
  }
  
  return 'https://backend-pos-production.up.railway.app'
}

const instance = axios.create({
  baseURL: getApiUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

console.log('Axios configured with baseURL:', getApiUrl())

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance

import { Configuration } from '@/api/generated/runtime'

// In development, use empty string to leverage Vite's proxy
// In production, use the configured API base URL
const basePath = import.meta.env.DEV 
  ? '' 
  : (import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '')

export const apiConfiguration = new Configuration({
  basePath,
  credentials: 'include', // Include cookies for authentication
})
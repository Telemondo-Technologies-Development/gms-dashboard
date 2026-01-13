import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: IndexRedirect,
})

function IndexRedirect() {
  useEffect(() => {
    // Redirect to /dashboard as the default route for testing
    window.location.replace('/dashboard')
  }, [])

  return null
}

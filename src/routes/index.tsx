import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: IndexRedirect,
})

function IndexRedirect() {
  useEffect(() => {
    // Redirect to /auth/login as the default route for testing
    window.location.replace('/auth/login')
  }, [])

  return null
}

import { createFileRoute } from '@tanstack/react-router'

import { DashboardLayout } from './dashboard/__layout'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

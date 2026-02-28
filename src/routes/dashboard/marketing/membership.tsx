import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import type { MemberFormData } from '@/types/membership/MembershipManagementSchema'
import MembershipAddAttendance from '@/components/membership-components/MembershipAttendanceTable'
import MembersTable from '@/components/membership-components/MembershipManagementTable'
import { MemberDetailsDialog } from '@/components/membership-components/MembershipDetailsDialog'
import { useMembersData } from '@/hooks/membership/useMembership'

export const Route = createFileRoute('/dashboard/marketing/membership')({
  component: MembershipRoute,
})

function MembershipRoute() {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedMemberGroupSnapshot, setSelectedMemberGroupSnapshot] = useState<MemberFormData | null>(null)

  const { enrichedMembers } = useMembersData()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4">
        <div className="lg:col-span-7">
          <MembersTable
            onSelectMember={(memberGroup) => {
              setSelectedMemberGroupSnapshot(memberGroup)
              setDetailsOpen(true)
            }}
          />
        </div>
        <div className="lg:col-span-3">
          <MembershipAddAttendance members={enrichedMembers} />
        </div>
      </div>
      <MemberDetailsDialog
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedMemberGroupSnapshot(null)
        }}
        memberGroup={selectedMemberGroupSnapshot}
      />
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import { Search, QrCode, Fingerprint, UserCheck, Clock } from 'lucide-react'

import type { MemberFormData, MemberInfo, AttendanceRecord, MembershipSearchForm } from '@/types/membership/memberSchemas'
import MembersTable from '@/components/membership-components/MembersTable'
import { MemberDetailsDialog } from '@/components/membership-components/MemberDetailsDialog'
import { useMembersData } from '@/hooks/membership/useMembers'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

export const Route = createFileRoute('/dashboard/marketing/membership')({
  component: MembershipRoute,
})

function MembershipRoute() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedMemberGroupSnapshot, setSelectedMemberGroupSnapshot] = useState<MemberFormData | null>(null)

  const { enrichedMembers, isLoading } = useMembersData()

  const form = useForm<MembershipSearchForm>({
    defaultValues: { searchQuery: '', attendanceSearch: '' },
  })

  const attendanceSearch = form.watch('attendanceSearch')

  // Memoize attendance marking handler
  const handleMarkAttendance = useCallback(
    (memberGroup: MemberFormData, memberInfo: MemberInfo, method: 'qr' | 'fingerprint' | 'manual') => {
      const newRecord: AttendanceRecord = {
        id: crypto.randomUUID(),
        memberId: memberInfo.id,
        memberName: memberInfo.name,
        membershipType: memberGroup.membershipType,
        checkInTime: new Date(),
        checkInMethod: method,
      }
      setAttendanceRecords((prev) => [newRecord, ...prev])
      form.setValue('attendanceSearch', '')
    },
    [form]
  )

  // Memoize icon getter
  const getCheckInMethodIcon = useCallback((method: 'qr' | 'fingerprint' | 'manual') => {
    const icons = {
      qr: <QrCode className="h-4 w-4 text-blue-500" />,
      fingerprint: <Fingerprint className="h-4 w-4 text-purple-500" />,
      manual: <UserCheck className="h-4 w-4 text-green-500" />,
    }
    return icons[method]
  }, [])

  // Memoize filtered search results
  const searchResults = useMemo(() => {
    if (!attendanceSearch) return []

    const query = attendanceSearch.toLowerCase()
    return enrichedMembers
      .map((memberGroup) => {
        const matches = memberGroup.members.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            (m.email ?? '').toLowerCase().includes(query) ||
            (m.phone ?? '').includes(query)
        )
        return matches.length > 0 ? { memberGroup, matches } : null
      })
      .filter(Boolean)
      .slice(0, 5)
  }, [attendanceSearch, enrichedMembers])

  // Memoize today's attendance
  const todayAttendance = useMemo(() => {
    const today = new Date().toDateString()
    return attendanceRecords.filter((record) => new Date(record.checkInTime).toDateString() === today)
  }, [attendanceRecords])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Membership Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MembersTable
          onSelectMember={(memberGroup) => {
            setSelectedMemberGroupSnapshot(memberGroup)
            setDetailsOpen(true)
          }}
          pageSize={8}
        />

        {/* Attendance Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>
                Check in members using QR code, fingerprint, or manual search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <Button type="button" variant="outline" className="h-24 flex flex-col gap-2" disabled>
                  <UserCheck className="h-8 w-8" />
                  <Label>Manual</Label>
                  <span className="text-xs text-muted-foreground">Search below</span>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search member by name, email, or phone..."
                    {...form.register('attendanceSearch')}
                    className="pl-9"
                  />
                </div>

                {attendanceSearch && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto divide-y">
                    {searchResults.length === 0 ? (
                      <div className="p-3 text-sm text-muted-foreground">No members found.</div>
                    ) : (
                      searchResults.map((result) => {
                        if (!result) return null
                        const { memberGroup, matches } = result
                        return (
                          <div key={memberGroup.id} className="p-3">
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                              {memberGroup.membershipType}
                            </div>
                            <div className="space-y-2">
                              {matches.map((member) => (
                                <div
                                  key={member.id}
                                  className="p-2 rounded-md flex hover:bg-muted/50 items-center justify-between"
                                >
                                  <div>
                                    <div className="font-medium">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {member.email} • {member.phone}
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => handleMarkAttendance(memberGroup, member, 'manual')}
                                  >
                                    Check In
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                {todayAttendance.length} check-ins today • {format(new Date(), 'EEEE, MMMM dd, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAttendance.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No check-ins recorded today. Use the check-in methods above to mark attendance.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member Name</TableHead>
                        <TableHead>Membership Type</TableHead>
                        <TableHead>Check-in Time</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="font-medium">{record.memberName}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{record.membershipType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(record.checkInTime, 'hh:mm a')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCheckInMethodIcon(record.checkInMethod)}
                              <span className="text-sm capitalize">{record.checkInMethod}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
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

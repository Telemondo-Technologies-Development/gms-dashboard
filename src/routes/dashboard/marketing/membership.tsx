import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AddMemberDialog, type MemberFormData, type MemberInfo } from '@/components/membership-components/AddMemberDialog'
import { MemberDetailsDialog } from '@/components/membership-components/MemberDetailsDialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Mail, Phone, Calendar, QrCode, Fingerprint, UserCheck, Clock } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/dashboard/marketing/membership')({
  component: MembershipRoute,
})

interface AttendanceRecord {
  id: string
  memberId: string
  memberName: string
  membershipType: string
  checkInTime: Date
  checkInMethod: 'qr' | 'fingerprint' | 'manual'
}

function MembershipRoute() {
  const [members, setMembers] = useState<MemberFormData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [attendanceSearch, setAttendanceSearch] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedMemberGroupId, setSelectedMemberGroupId] = useState<string | null>(null)

  const handleAddMember = (member: MemberFormData) => {
    setMembers(prev => [member, ...prev])
  }

  const handleMarkAttendance = (
    memberGroup: MemberFormData,
    memberInfo: MemberInfo,
    method: 'qr' | 'fingerprint' | 'manual',
  ) => {
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      memberId: memberInfo.id,
      memberName: memberInfo.name,
      membershipType: memberGroup.membershipType,
      checkInTime: new Date(),
      checkInMethod: method,
    }
    setAttendanceRecords(prev => [newRecord, ...prev])
    setAttendanceSearch('')
  }

  const filteredMembers = members.filter(memberGroup =>
    memberGroup.members.some(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery)
    ) ||
    memberGroup.membershipType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedMemberGroup = selectedMemberGroupId
    ? members.find((m) => m.id === selectedMemberGroupId) ?? null
    : null

  const filteredAttendanceMembers = members.filter(memberGroup =>
    memberGroup.members.some(m =>
      m.name.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      m.phone.includes(attendanceSearch)
    )
  )

  const todayAttendance = attendanceRecords.filter(record => {
    const today = new Date()
    const recordDate = new Date(record.checkInTime)
    return recordDate.toDateString() === today.toDateString()
  })

  const getMembershipStatusBadge = (endDate: Date | undefined) => {
    if (!endDate) return <Badge variant="secondary">No Date</Badge>
    
    const today = new Date()
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (daysUntilExpiry <= 7) {
      return <Badge variant="destructive">Expiring Soon</Badge>
    } else if (daysUntilExpiry <= 30) {
      return <Badge variant="outline">Ending Soon</Badge>
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  const getCheckInMethodIcon = (method: 'qr' | 'fingerprint' | 'manual') => {
    switch (method) {
      case 'qr':
        return <QrCode className="h-4 w-4 text-blue-500" />
      case 'fingerprint':
        return <Fingerprint className="h-4 w-4 text-purple-500" />
      case 'manual':
        return <UserCheck className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-6"> 
      <div className="flex items-center justify-between">
        <div>
        </div>
        <AddMemberDialog onAddMember={handleAddMember} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Card */}
        <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? 'member' : 'members'} registered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, phone, or membership type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-3">Tip: Click a row to view/edit full details and billing.</div>

              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {members.length === 0 
                      ? 'No members registered yet. Add your first member to get started.' 
                      : 'No members found matching your search.'}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Name</TableHead>
                        <TableHead className="w-[30%]">Contact</TableHead>
                        <TableHead className="w-[25%]">Duration</TableHead>
                        <TableHead className="w-[15%]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((memberGroup) => (
                        <TableRow
                          key={memberGroup.id}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => {
                            setSelectedMemberGroupId(memberGroup.id)
                            setDetailsOpen(true)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedMemberGroupId(memberGroup.id)
                              setDetailsOpen(true)
                            }
                          }}
                        >
                          <TableCell>
                            <div className="space-y-1">
                              {memberGroup.members.map((member, idx) => (
                                <div key={idx} className="font-medium">
                                  {member.name}
                                  {memberGroup.members.length > 1 && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {idx + 1}/{memberGroup.members.length}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2 min-w-0">
                              {memberGroup.members.map((member, idx) => (
                                <div key={idx} className="flex flex-col gap-1 text-sm min-w-0">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate">{member.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span className="truncate">{member.phone}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 text-sm">
                              {memberGroup.startDate && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(memberGroup.startDate, 'MMM dd, yyyy')}
                                </div>
                              )}
                              {memberGroup.endDate && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(memberGroup.endDate, 'MMM dd, yyyy')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getMembershipStatusBadge(memberGroup.endDate)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

        <MemberDetailsDialog
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open)
            if (!open) setSelectedMemberGroupId(null)
          }}
          memberGroup={selectedMemberGroup}
          onSave={(updated) => {
            setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
          }}
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
                  <span>Manual</span>
                  <span className="text-xs text-muted-foreground">Search below</span>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search member by name, email, or phone..."
                    value={attendanceSearch}
                    onChange={(e) => setAttendanceSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {attendanceSearch && filteredAttendanceMembers.length > 0 && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto divide-y">
                    {filteredAttendanceMembers.slice(0, 5).map((memberGroup) => {
                      const query = attendanceSearch.toLowerCase()
                      const matches = memberGroup.members.filter((m) => {
                        return (
                          m.name.toLowerCase().includes(query) ||
                          m.email.toLowerCase().includes(query) ||
                          m.phone.includes(attendanceSearch)
                        )
                      })

                      if (matches.length === 0) return null

                      return (
                        <div key={memberGroup.id} className="p-3">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            Group: {memberGroup.membershipType}
                          </div>
                          <div className="space-y-2">
                            {matches.map((member) => (
                              <div
                                key={member.id}
                                className="p-2 rounded-md hover:bg-accent flex items-center justify-between"
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
                    })}
                  </div>
                )}

                {attendanceSearch && filteredAttendanceMembers.length === 0 && (
                  <div className="text-sm text-muted-foreground">No members found.</div>
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
    </div>
  )
}

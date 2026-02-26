import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Search, User } from 'lucide-react'

import type { AttendanceTableRow, MembershipAddAttendanceProps,  } from '@/types/membership/memberSchemas'
import { useAttendance } from '@/hooks/membership/useMembershipAttendance'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


export default function MembershipAddAttendance({ members }: MembershipAddAttendanceProps) {
	const [searchInput, setSearchInput] = useState('')
	const [submittedQuery, setSubmittedQuery] = useState('')

	const attendanceQuery = useAttendance()

	const memberByActorId = useMemo(() => {
		const map = new Map<string, { name: string; membershipType: string }>()
		for (const group of members) {
			if (!group.actorId) continue
			const firstMember = group.members[0]
			map.set(group.actorId, {
				name: firstMember?.name ?? 'Unknown Member',
				membershipType: group.membershipType || 'Member',
			})
		}
		return map
	}, [members])

	const attendedRows = useMemo<AttendanceTableRow[]>(() => {
		const records = (attendanceQuery.data ?? []).filter((record) => record.type === 'IN')
		const uniqueByActorId = new Map<string, (typeof records)[number]>()

		for (const record of records) {
			const key = record.actorId ?? record.id
			if (!uniqueByActorId.has(key)) {
				uniqueByActorId.set(key, record)
			}
		}

		return Array.from(uniqueByActorId.values()).map((record) => {
			const actorId = record.actorId ?? ''
			const member = memberByActorId.get(actorId)

			return {
				id: record.id,
				actorId,
				memberName: member?.name ?? `Member ${actorId.slice(0, 8)}`,
				membershipType: member?.membershipType ?? 'Member',
				source: record.source,
				status: record.type,
			}
		})
	}, [attendanceQuery.data, memberByActorId])

	const filteredRows = useMemo(() => {
		if (!submittedQuery) return attendedRows
		const query = submittedQuery.toLowerCase()

		return attendedRows.filter(
			(record) =>
				record.memberName.toLowerCase().includes(query) ||
				record.membershipType.toLowerCase().includes(query) ||
				record.actorId.toLowerCase().includes(query) ||
				record.source.toLowerCase().includes(query) ||
				record.status.toLowerCase().includes(query),
		)
	}, [submittedQuery, attendedRows])

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSubmittedQuery(searchInput.trim())
	}

	return (
		<Card className="flex flex-col h-full shadow-md border-muted/40">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-xl font-bold tracking-tight">Today's Attendance</CardTitle>
						<CardDescription className="mt-1">
							{filteredRows.length} attended today • {format(new Date(), 'EEEE, MMMM dd, yyyy')}
						</CardDescription>
					</div>
					<Badge variant="default" className="px-3 py-1 text-sm">
						Total: {filteredRows.length}
					</Badge>
				</div>
			</CardHeader>
			<div className="flex-1 min-h-0 overflow-auto">
				<CardContent className="p-0">
					<div className="px-6 py-4 border-b bg-muted/5 flex items-center gap-3">
						<form className="relative flex-1 max-w-sm" onSubmit={handleSearchSubmit}>
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
							<Input
								placeholder="Search attended member..."
								value={searchInput}
								onChange={(event) => setSearchInput(event.target.value)}
								className="pl-9 h-10 bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
							/>
							<button type="submit" className="hidden">Search</button>
						</form>
					</div>

					{attendanceQuery.isLoading ? (
						<div className="text-center py-8 text-sm text-muted-foreground">Loading attendance records...</div>
					) : filteredRows.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 text-center px-4">
							<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
								<User className="h-6 w-6 text-muted-foreground" />
							</div>
							<h3 className="text-lg font-semibold mb-2">No attendance records found</h3>
							<p className="text-muted-foreground max-w-sm mb-6">
								No members have been marked as attended today.
							</p>
						</div>
					) : (
						<div className="relative w-full overflow-auto">
							<Table>
								<TableHeader className="bg-muted/30">
									<TableRow className="hover:bg-transparent border-b border-muted/60">
										<TableHead className="w-[40%] pl-6 py-4 font-semibold text-foreground/70">Member Name</TableHead>
										<TableHead className="w-[25%] py-4 font-semibold text-foreground/70">Membership Type</TableHead>
										<TableHead className="w-[20%] py-4 font-semibold text-foreground/70">Source</TableHead>
										<TableHead className="w-[15%] py-4 font-semibold text-foreground/70 pr-6">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredRows.map((record) => (
										<TableRow key={record.id} className="hover:bg-muted/40 transition-colors group border-b border-muted/40">
											<TableCell className="pl-6 py-4 align-top">
												<div className="font-medium text-foreground group-hover:text-primary transition-colors">{record.memberName}</div>
											</TableCell>
											<TableCell className="py-4 align-top">
												<Badge variant="outline" className="font-medium border-primary/20 bg-primary/5 text-primary">{record.membershipType}</Badge>
											</TableCell>
											<TableCell className="py-4 align-top">
												<Badge variant="outline" className="text-muted-foreground">{record.source}</Badge>
											</TableCell>
											<TableCell className="py-4 align-top pr-6">
												<Badge className="bg-green-500 hover:bg-green-600">{record.status}</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{attendanceQuery.isError && (
						<div className="m-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2" role="alert">
							<span className="font-semibold">Error:</span>
							{(attendanceQuery.error as Error).message || 'Failed to load attendance records.'}
						</div>
					)}
				</CardContent>
			</div>
		</Card>
	)
}


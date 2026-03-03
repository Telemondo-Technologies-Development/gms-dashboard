import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Search, User, Calendar as CalendarIcon, Eye, Trash2, MoreHorizontal } from 'lucide-react'

import type { AttendanceTableRow, MembershipAddAttendanceProps } from '@/types/membership/MembershipManagementSchema'
import { useAttendance } from '@/hooks/membership/useMembershipAttendance'
import { getAttendanceRecordDate, sortAttendanceRowsByDateStack } from '@/types/membership/MembershipAttendanceSchema'
import { parseCalendarDay, toStartOfDay } from '@/lib/date-utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'


export default function MembershipAddAttendance({ members }: MembershipAddAttendanceProps) {
	const [searchInput, setSearchInput] = useState('')
	const [submittedQuery, setSubmittedQuery] = useState('')
	const [selectedDay, setSelectedDay] = useState('')
	const [pageIndex, setPageIndex] = useState(0)
	const PAGE_SIZE = 6

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
			const attendanceDate = getAttendanceRecordDate(record)

			return {
				id: record.id,
				actorId,
				memberName: member?.name ?? `Member ${actorId.slice(0, 8)}`,
				membershipType: member?.membershipType ?? 'Member',
				source: record.source,
				status: record.type,
				attendanceDate,
			}
		})
	}, [attendanceQuery.data, memberByActorId])

	const filteredRows = useMemo(() => {
		const searchedRows = !submittedQuery
			? attendedRows
			: attendedRows.filter(
				(record) =>
					record.memberName.toLowerCase().includes(submittedQuery.toLowerCase()) ||
					record.membershipType.toLowerCase().includes(submittedQuery.toLowerCase()) ||
					record.actorId.toLowerCase().includes(submittedQuery.toLowerCase()) ||
					record.source.toLowerCase().includes(submittedQuery.toLowerCase()) ||
					record.status.toLowerCase().includes(submittedQuery.toLowerCase()),
			)

		if (!selectedDay) {
			return sortAttendanceRowsByDateStack(searchedRows)
		}

		const targetDay = parseCalendarDay(selectedDay)
		if (!targetDay) {
			return sortAttendanceRowsByDateStack(searchedRows)
		}

		const dayRows = searchedRows.filter((record) => {
			if (!record.attendanceDate) return false
			return toStartOfDay(record.attendanceDate).getTime() === targetDay.getTime()
		})

		return sortAttendanceRowsByDateStack(dayRows)
	}, [attendedRows, selectedDay, submittedQuery])

	const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setSubmittedQuery(searchInput.trim())
		setPageIndex(0)
	}

	const pageCount = Math.ceil(filteredRows.length / PAGE_SIZE)
	const pageItems = filteredRows.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)

	return (
		<Card className="flex flex-col shadow-md border-muted/40 w-full">
			<CardHeader>
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
					<div className="p-4 border-b bg-muted/5 flex flex-col md:flex-row items-stretch md:items-center gap-3">
						<form className="relative w-full md:max-w-sm" onSubmit={handleSearchSubmit}>
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground" />
							<Input
								placeholder="Search attended member..."
								value={searchInput}
								onChange={(event) => setSearchInput(event.target.value)}
								className="pl-9 h-10 w-full bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-0"
							/>
							<button type="submit" className="hidden">Search</button>
						</form>
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:ml-auto">
							<Popover>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className={`justify-start text-left font-normal h-10 w-full sm:w-45 bg-background/50 border-muted-foreground/20 ${!selectedDay ? 'text-muted-foreground' : ''}`}
									>
										<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
										<span className="truncate">
											{selectedDay ? format(new Date(selectedDay), 'MMM d, yyyy') : 'Select Date'}
										</span>
									</Button>
								</PopoverTrigger>
							<PopoverContent className="w-auto p-2" align="start">
								<Calendar
									mode="single"
									selected={selectedDay ? parseCalendarDay(selectedDay) ?? undefined : undefined}
									onSelect={(date) => {
										setSelectedDay(date ? format(date, 'yyyy-MM-dd') : '')
										setPageIndex(0)
									}}
									initialFocus
								/>
								<div className="mt-2 flex items-center justify-end gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											setSelectedDay('')
											setPageIndex(0)
										}}
									>
										Clear
									</Button>
									<Button
										type="button"
										size="sm"
										onClick={() => {
											setSelectedDay(format(new Date(), 'yyyy-MM-dd'))
											setPageIndex(0)
										}}
									>
										Today
									</Button>
								</div>
							</PopoverContent>
						</Popover>
						</div>
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
										<TableHead className="w-[40%] pl-6">Member</TableHead>
										<TableHead className="w-[25%]">Source</TableHead>
										<TableHead className="w-[20%] text-right">Status</TableHead>
										<TableHead className="w-[15%] pr-6 text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{pageItems.map((record) => (
										<TableRow key={record.id} className="hover:bg-muted/40 transition-colors group border-b border-muted/40">
											<TableCell className="pl-6 py-4 align-top">
												<div className="flex flex-col gap-1.5">
													<div className="font-semibold text-foreground group-hover:text-primary transition-colors">{record.memberName}</div>
													<div>
														<Badge variant="outline" className="font-medium border-primary/20 bg-primary/5 text-primary break-words whitespace-normal text-left sm:max-w-[150px]">{record.membershipType}</Badge>
													</div>
												</div>
											</TableCell>
											<TableCell className="py-4 align-top">
												<Badge variant="outline" className="text-muted-foreground">{record.source}</Badge>
											</TableCell>
											<TableCell className="py-4 align-top text-right">
												<Badge className="bg-green-500 hover:bg-green-600">{record.status}</Badge>
											</TableCell>
											<TableCell className="py-4 align-top text-right pr-6">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" className="h-8 w-8 p-0">
															<span className="sr-only">Open menu</span>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuItem className="cursor-pointer" onClick={() => console.log('View', record.id)}>
															<Eye className="mr-2 h-4 w-4" />
															View Details
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => console.log('Delete', record.id)}>
															<Trash2 className="mr-2 h-4 w-4" />
															Delete Record
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
								{filteredRows.length > 0 && (
									<TableFooter className="bg-muted/5">
										<TableRow className="hover:bg-transparent">
											<TableCell colSpan={4} className="p-0">
												<div className="flex flex-col items-center gap-2 p-4 sm:flex-row sm:justify-between w-full h-full">
													<div className="text-sm text-center text-muted-foreground sm:text-left">
														Showing {Math.min(pageIndex * PAGE_SIZE + 1, filteredRows.length)} to {Math.min((pageIndex + 1) * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} entries
													</div>
													<div className="flex items-center gap-2">
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
															disabled={pageIndex <= 0}
															className="h-8 px-3 text-xs"
														>
															Previous
														</Button>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => setPageIndex((p) => Math.min(pageCount - 1, p + 1))}
															disabled={pageIndex >= Math.max(0, pageCount - 1)}
															className="h-8 px-3 text-xs"
														>
															Next
														</Button>
													</div>
												</div>
											</TableCell>
										</TableRow>
									</TableFooter>
								)}
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


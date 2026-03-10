import { format } from 'date-fns'
import { Clock } from 'lucide-react'

import type { MemberTableDTO } from '@/api/generated/models/MemberTableDTO'
import type { MemberSubscriptionTableDTO } from '@/api/generated/models/MemberSubscriptionTableDTO'
import type { InvoiceTableDTOParsed } from '@/types/payment/paymentSchemas'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

export type DerivedMemberStatus = 'ACTIVE' | 'DUE' | 'INACTIVE' | 'DEACTIVATED' | 'UNDECIDED'

/**
 * Derives the display status for a member based on their subscriptions and invoice history.
 * Flow: subscription issued → invoice generated → DUE (within grace period) → OVERDUE (grace expired) → DEACTIVATED
 */
export function deriveMemberStatus(
  member: MemberTableDTO,
  subscriptions: MemberSubscriptionTableDTO[],
  invoices: InvoiceTableDTOParsed[],
): DerivedMemberStatus {
  const memberSubs = subscriptions.filter((s) => s.actorId === member.actorId)
  const activeSub = memberSubs.find((s) => s.status === 'ACTIVE')

  if (!activeSub) return 'INACTIVE'

  const subInvoices = invoices.filter((inv) => inv.memberSubscriptionId === activeSub.id)

  // Grace period exceeded — failed to pay → DEACTIVATED
  if (subInvoices.some((inv) => inv.status === 'OVERDUE')) return 'DEACTIVATED'

  // Invoice issued, within grace period — payment pending
  if (subInvoices.some((inv) => inv.status === 'DUE' || inv.status === 'ISSUED' || inv.status === 'PENDING'))
    return 'DUE'

  return member.status === 'ACTIVE' ? 'ACTIVE' : (member.status as DerivedMemberStatus)
}

function statusVariant(status: DerivedMemberStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'ACTIVE') return 'default'
  if (status === 'DEACTIVATED') return 'destructive'
  if (status === 'DUE') return 'outline'
  return 'secondary'
}

function subStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'ACTIVE') return 'default'
  if (status === 'CANCELED') return 'destructive'
  return 'secondary'
}

function invoiceStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'PAID') return 'default'
  if (status === 'OVERDUE') return 'destructive'
  if (status === 'DUE' || status === 'ISSUED' || status === 'PENDING') return 'outline'
  if (status === 'PARTIAL') return 'secondary'
  return 'secondary'
}

interface MemberProgressSheetProps {
  member: MemberTableDTO | null
  subscriptions: MemberSubscriptionTableDTO[]
  invoices: InvoiceTableDTOParsed[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberProgressSheet({ member, subscriptions, invoices, open, onOpenChange }: MemberProgressSheetProps) {
  if (!member) return null

  const fullName = [member.firstName, member.middleName, member.surname, member.suffix].filter(Boolean).join(' ')
  const derivedStatus = deriveMemberStatus(member, subscriptions, invoices)

  const memberSubs = subscriptions
    .filter((s) => s.actorId === member.actorId)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">{fullName}</SheetTitle>
          <SheetDescription className="flex items-center gap-2">
            <Badge variant={statusVariant(derivedStatus)}>{derivedStatus}</Badge>
            <span className="text-muted-foreground text-sm">Member Progress</span>
          </SheetDescription>
        </SheetHeader>

        {memberSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No subscription history found.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-6">
              {memberSubs.map((sub, index) => {
                const subInvoices = invoices.filter((inv) => inv.memberSubscriptionId === sub.id)
                return (
                  <div key={sub.id} className="flex gap-4 relative">
                    <div
                      className={`relative z-10 mt-1 h-7 w-7 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold
                        ${sub.status === 'ACTIVE' ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-muted-foreground/40 text-muted-foreground'}`}
                    >
                      {memberSubs.length - index}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">
                          {sub.subscriptionName ?? `Subscription ${memberSubs.length - index}`}
                        </span>
                        <Badge variant={subStatusVariant(sub.status)} className="text-xs">
                          {sub.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5 mb-2">
                        <div>
                          <span className="font-medium">Start:</span>{' '}
                          {format(new Date(sub.startDate), 'MMM d, yyyy')}
                        </div>
                        {sub.endDate && (
                          <div>
                            <span className="font-medium">End:</span>{' '}
                            {format(new Date(sub.endDate), 'MMM d, yyyy')}
                          </div>
                        )}
                        {sub.branchName && (
                          <div>
                            <span className="font-medium">Branch:</span> {sub.branchName}
                          </div>
                        )}
                      </div>

                      {subInvoices.length > 0 && (
                        <div className="space-y-1.5 mt-2 border-l-2 border-muted pl-3">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Invoices</p>
                          {subInvoices
                            .sort((a, b) => (b.issuedAt?.getTime() ?? 0) - (a.issuedAt?.getTime() ?? 0))
                            .map((inv) => (
                              <div key={inv.id} className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {inv.issuedAt ? format(inv.issuedAt, 'MMM d, yyyy') : '—'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-medium">
                                    {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(inv.total)}
                                  </span>
                                  <Badge variant={invoiceStatusVariant(inv.status)} className="text-xs py-0">{inv.status}</Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

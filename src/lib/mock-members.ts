import type { MemberFormData } from '@/types/membership/memberSchemas'

export const mockMembers: MemberFormData[] = [
  {
    id: 'group-1',
    members: [
      { id: 'm-1', name: 'Ana Santos', email: 'ana.santos@example.com', phone: '+63 912 345 6789' },
    ],
    startDate: new Date('2025-12-01'),
    endDate: new Date('2026-12-01'),
    membershipType: 'premium',
    membershipDuration: '12-months',
    billingAmount: '1500.00',
    billingCycle: 'monthly',
    paymentMethod: 'credit-card',
    membershipDetails: 'Primary member. Prefers morning sessions.',
    documents: [],
  },
  {
    id: 'group-2',
    members: [
      { id: 'm-2', name: 'Carlos Rivera', email: 'carlos.rivera@example.com', phone: '+63 998 765 4321' },
    ],
    startDate: new Date('2026-01-05'),
    endDate: new Date('2026-04-05'),
    membershipType: 'standard',
    membershipDuration: '3-months',
    billingAmount: '800.00',
    billingCycle: 'monthly',
    paymentMethod: 'bank-transfer',
    membershipDetails: 'Family plan, 2 members. Needs weekend access.',
    documents: [],
  },
  {
    id: 'group-3',
    members: [
      { id: 'm-3', name: 'Liza Moreno', email: 'liza.moreno@example.com', phone: '+63 917 555 0101' },
    ],
    startDate: new Date('2025-11-15'),
    endDate: new Date('2026-02-14'),
    membershipType: 'basic',
    membershipDuration: '3-months',
    billingAmount: '500.00',
    billingCycle: 'monthly',
    paymentMethod: 'gcash',
    membershipDetails: 'Trial upgraded to basic. Add medical note in docs.',
    documents: [],
  },
]

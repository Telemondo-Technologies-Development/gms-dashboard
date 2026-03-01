  export const memberQueryKeys = {
    members: 'members',
    memberSubscriptions: 'memberSubscriptions',
    attendances: 'attendances',

  }

export const invoiceQueryKeys = {
  invoices: 'invoices',
}

export const paymentQueryKeys = {
  payments: 'payments',
  paymentMethods: 'payment-methods',
}

export const subscriptionAvailedQueryKeys = {
  subscriptionAvailed: 'subscription-availed',
}

export const billingCycleQueryKeys = {
  billingCycles: 'billing-cycles',
}

export const branchQueryKeys = {
  branches: 'branches',
}

export const userQueryKeys = {
  currentUser: 'current-user',
}

export const employeeQueryKeys = {
  employee: ['employees'] as const,
}

export const expenseQueryKeys = {
  all:              ['expenses'],
  asset:            ['expenses', 'asset'],
  assetMaintenance: ['expenses', 'asset-maintenance'],
  salary:           ['expenses', 'salary'],
  utility:          ['expenses', 'utility'],
  supplies:         ['expenses', 'supplies'],
  other:            ['expenses', 'other'],
} as const

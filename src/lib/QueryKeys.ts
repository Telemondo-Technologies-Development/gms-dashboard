  export const memberQueryKeys = {
    members: 'members',
    memberSubscriptions: 'memberSubscriptions',
    attendances: 'attendances',

  }

export const invoiceQueryKeys = {
  invoices: 'invoices',
}

<<<<<<< HEAD
  export const paymentQueryKeys = {
    payments: 'payments',
    paymentMethods: 'payment-methods',
    paymentHistoryMembers: 'payment-history-members',
=======
export const paymentQueryKeys = {
  payments: 'payments',
  paymentMethods: 'payment-methods',
}
>>>>>>> 203bfe14efb6d9da5a65b2a78aa84d8b084df578

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
  employee: 'employees',
}

<<<<<<< HEAD
  export const employeeQueryKeys = {
    employee: ['employees'] as const,
  }

  
=======
export const expenseQueryKeys = {
  all:              ['expenses'],
  asset:            ['expenses', 'asset'],
  assetMaintenance: ['expenses', 'asset-maintenance'],
  salary:           ['expenses', 'salary'],
  utility:          ['expenses', 'utility'],
  supplies:         ['expenses', 'supplies'],
  other:            ['expenses', 'other'],
} as const
>>>>>>> 203bfe14efb6d9da5a65b2a78aa84d8b084df578

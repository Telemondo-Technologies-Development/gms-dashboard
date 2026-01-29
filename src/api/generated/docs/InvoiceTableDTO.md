
# InvoiceTableDTO

Format for Invoice read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`dueDate` | Date
`gracePeriodDate` | Date
`id` | string
`issuedAt` | Date
`memberSubscriptionId` | string
`status` | string
`subscriptionAvailedId` | string
`subtotal` | number
`systemGenerated` | boolean
`total` | number
`updatedById` | string

## Example

```typescript
import type { InvoiceTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "dueDate": null,
  "gracePeriodDate": null,
  "id": null,
  "issuedAt": null,
  "memberSubscriptionId": null,
  "status": null,
  "subscriptionAvailedId": null,
  "subtotal": null,
  "systemGenerated": null,
  "total": null,
  "updatedById": null,
} satisfies InvoiceTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InvoiceTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



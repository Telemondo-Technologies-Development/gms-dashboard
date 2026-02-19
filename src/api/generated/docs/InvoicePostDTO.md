
# InvoicePostDTO

Format for Invoice create

## Properties

Name | Type
------------ | -------------
`actorId` | string
`createdById` | string
`dueDate` | Date
`gracePeriodDate` | Date
`memberSubscriptionId` | string
`status` | string
`subtotal` | number
`systemGenerated` | boolean

## Example

```typescript
import type { InvoicePostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "createdById": null,
  "dueDate": null,
  "gracePeriodDate": null,
  "memberSubscriptionId": null,
  "status": null,
  "subtotal": null,
  "systemGenerated": null,
} satisfies InvoicePostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InvoicePostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



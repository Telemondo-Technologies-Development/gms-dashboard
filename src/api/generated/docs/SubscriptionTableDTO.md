
# SubscriptionTableDTO

Format for Subscription read

## Properties

Name | Type
------------ | -------------
`amount` | number
`billingCycleId` | string
`createdAt` | Date
`createdById` | string
`description` | string
`id` | string
`name` | string
`updatedAt` | Date
`updatedById` | string

## Example

```typescript
import type { SubscriptionTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "billingCycleId": null,
  "createdAt": null,
  "createdById": null,
  "description": null,
  "id": null,
  "name": null,
  "updatedAt": null,
  "updatedById": null,
} satisfies SubscriptionTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



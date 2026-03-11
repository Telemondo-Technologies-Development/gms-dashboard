
# SubscriptionPutDTO

Format for Subscription update

## Properties

Name | Type
------------ | -------------
`amount` | number
`billingCycleId` | string
`description` | string
`name` | string
`updatedById` | string

## Example

```typescript
import type { SubscriptionPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "billingCycleId": null,
  "description": null,
  "name": null,
  "updatedById": null,
} satisfies SubscriptionPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



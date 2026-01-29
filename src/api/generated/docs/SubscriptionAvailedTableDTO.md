
# SubscriptionAvailedTableDTO

Format for Subscription Availed read

## Properties

Name | Type
------------ | -------------
`amount` | number
`gracePeriodDays` | number
`id` | string
`intervalCount` | number
`intervals` | string
`name` | string

## Example

```typescript
import type { SubscriptionAvailedTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "gracePeriodDays": null,
  "id": null,
  "intervalCount": null,
  "intervals": null,
  "name": null,
} satisfies SubscriptionAvailedTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionAvailedTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



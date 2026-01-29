
# BillingCycleTableDTO

Format for Billing Cycle read

## Properties

Name | Type
------------ | -------------
`gracePeriodDays` | number
`id` | string
`intervalCount` | number
`intervals` | string
`name` | string

## Example

```typescript
import type { BillingCycleTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "gracePeriodDays": null,
  "id": null,
  "intervalCount": null,
  "intervals": null,
  "name": null,
} satisfies BillingCycleTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BillingCycleTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



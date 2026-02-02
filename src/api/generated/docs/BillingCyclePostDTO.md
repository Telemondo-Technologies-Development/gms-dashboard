
# BillingCyclePostDTO

Format for Billing Cycle create

## Properties

Name | Type
------------ | -------------
`createdById` | string
`gracePeriodDays` | number
`intervalCount` | number
`intervals` | string
`name` | string

## Example

```typescript
import type { BillingCyclePostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "createdById": null,
  "gracePeriodDays": null,
  "intervalCount": null,
  "intervals": null,
  "name": null,
} satisfies BillingCyclePostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BillingCyclePostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



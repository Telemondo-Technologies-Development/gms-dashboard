
# MemberSubscriptionTableDTO

Format for MemberSubscription read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`endDate` | Date
`id` | string
`startDate` | Date
`status` | string
`subscriptionAvailedId` | string
`updatedById` | string

## Example

```typescript
import type { MemberSubscriptionTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "endDate": null,
  "id": null,
  "startDate": null,
  "status": null,
  "subscriptionAvailedId": null,
  "updatedById": null,
} satisfies MemberSubscriptionTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MemberSubscriptionTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



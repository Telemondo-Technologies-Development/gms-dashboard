
# MemberSubscriptionPutDTO

Format for MemberSubscription update

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`endDate` | Date
`startDate` | Date
`status` | string
`subscriptionId` | string
`updateCurrentSubscription` | boolean
`updatedById` | string

## Example

```typescript
import type { MemberSubscriptionPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "endDate": null,
  "startDate": null,
  "status": null,
  "subscriptionId": null,
  "updateCurrentSubscription": null,
  "updatedById": null,
} satisfies MemberSubscriptionPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MemberSubscriptionPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



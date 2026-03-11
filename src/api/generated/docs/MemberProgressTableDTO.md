
# MemberProgressTableDTO

Format for Member Progress read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`id` | string
`progressHistory` | [Array&lt;MemberProgressHistoryBrief&gt;](MemberProgressHistoryBrief.md)
`progressId` | string
`progressOptionId` | string
`remarks` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { MemberProgressTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "id": null,
  "progressHistory": null,
  "progressId": null,
  "progressOptionId": null,
  "remarks": null,
  "status": null,
  "updatedById": null,
} satisfies MemberProgressTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MemberProgressTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



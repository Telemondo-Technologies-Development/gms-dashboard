
# MemberProgressPostDTO

Format for Member Progress create

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`progressId` | string
`progressOptionId` | string
`remarks` | string
`status` | string

## Example

```typescript
import type { MemberProgressPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "progressId": null,
  "progressOptionId": null,
  "remarks": null,
  "status": null,
} satisfies MemberProgressPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MemberProgressPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



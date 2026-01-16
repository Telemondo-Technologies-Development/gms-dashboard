
# BranchPutDTO

Format for Branch update

## Properties

Name | Type
------------ | -------------
`address` | string
`latitude` | string
`longitude` | string
`name` | string
`profilePictureId` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { BranchPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "address": null,
  "latitude": null,
  "longitude": null,
  "name": null,
  "profilePictureId": null,
  "status": null,
  "updatedById": null,
} satisfies BranchPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



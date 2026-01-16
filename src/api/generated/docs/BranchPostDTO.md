
# BranchPostDTO

Format for Branch create

## Properties

Name | Type
------------ | -------------
`address` | string
`createdById` | string
`latitude` | string
`longitude` | string
`name` | string
`profilePictureId` | string
`status` | string

## Example

```typescript
import type { BranchPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "address": null,
  "createdById": null,
  "latitude": null,
  "longitude": null,
  "name": null,
  "profilePictureId": null,
  "status": null,
} satisfies BranchPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



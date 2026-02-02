
# BranchTableDTO

Format for Branch read

## Properties

Name | Type
------------ | -------------
`address` | string
`createdById` | string
`id` | string
`latitude` | string
`longitude` | string
`name` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { BranchTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "address": null,
  "createdById": null,
  "id": null,
  "latitude": null,
  "longitude": null,
  "name": null,
  "status": null,
  "updatedById": null,
} satisfies BranchTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# BranchPersonnelPutDTO

Format for Branch Personnel update

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`personnelRoleId` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { BranchPersonnelPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "personnelRoleId": null,
  "status": null,
  "updatedById": null,
} satisfies BranchPersonnelPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchPersonnelPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



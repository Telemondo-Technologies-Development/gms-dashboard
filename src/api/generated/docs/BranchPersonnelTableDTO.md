
# BranchPersonnelTableDTO

Format for Branch Personnel read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdAt` | Date
`createdById` | string
`id` | string
`personnelRoleId` | string
`status` | string
`updatedAt` | Date
`updatedById` | string

## Example

```typescript
import type { BranchPersonnelTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdAt": null,
  "createdById": null,
  "id": null,
  "personnelRoleId": null,
  "status": null,
  "updatedAt": null,
  "updatedById": null,
} satisfies BranchPersonnelTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchPersonnelTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



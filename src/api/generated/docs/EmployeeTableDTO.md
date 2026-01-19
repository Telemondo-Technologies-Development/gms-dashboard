
# EmployeeTableDTO

Format for Employee read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`contactNo` | string
`firstName` | string
`id` | string
`middleName` | string
`status` | string
`suffix` | string
`surname` | string
`user` | [UserTableDTO](UserTableDTO.md)

## Example

```typescript
import type { EmployeeTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "contactNo": null,
  "firstName": null,
  "id": null,
  "middleName": null,
  "status": null,
  "suffix": null,
  "surname": null,
  "user": null,
} satisfies EmployeeTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



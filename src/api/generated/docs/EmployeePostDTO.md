
# EmployeePostDTO

Format for Employee create

## Properties

Name | Type
------------ | -------------
`contactNo` | string
`firstName` | string
`middleName` | string
`profilePictureId` | string
`status` | string
`suffix` | string
`surname` | string
`userId` | string

## Example

```typescript
import type { EmployeePostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "contactNo": null,
  "firstName": null,
  "middleName": null,
  "profilePictureId": null,
  "status": null,
  "suffix": null,
  "surname": null,
  "userId": null,
} satisfies EmployeePostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeePostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



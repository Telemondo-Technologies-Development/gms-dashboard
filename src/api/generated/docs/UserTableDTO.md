
# UserTableDTO


## Properties

Name | Type
------------ | -------------
`actorId` | string
`createdAt` | Date
`id` | string
`updatedAt` | Date
`userRoles` | [Array&lt;UserRoleBriefDTO&gt;](UserRoleBriefDTO.md)
`username` | string

## Example

```typescript
import type { UserTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "createdAt": null,
  "id": null,
  "updatedAt": null,
  "userRoles": null,
  "username": null,
} satisfies UserTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



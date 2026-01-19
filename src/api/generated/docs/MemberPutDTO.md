
# MemberPutDTO

Format for Member update

## Properties

Name | Type
------------ | -------------
`firstName` | string
`middleName` | string
`profilePictureId` | string
`status` | string
`suffix` | string
`surname` | string
`updatedById` | string

## Example

```typescript
import type { MemberPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": null,
  "middleName": null,
  "profilePictureId": null,
  "status": null,
  "suffix": null,
  "surname": null,
  "updatedById": null,
} satisfies MemberPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MemberPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



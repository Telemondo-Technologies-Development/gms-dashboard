
# MemberTableDTO

Format for Member read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`createdByEmail` | string
`createdByFirstName` | string
`createdById` | string
`createdBySurname` | string
`createdByType` | string
`firstName` | string
`id` | string
`middleName` | string
`status` | string
`suffix` | string
`surname` | string
`updatedByEmail` | string
`updatedByFirstName` | string
`updatedById` | string
`updatedBySurname` | string
`updatedByType` | string

## Example

```typescript
import type { MemberTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "createdByEmail": null,
  "createdByFirstName": null,
  "createdById": null,
  "createdBySurname": null,
  "createdByType": null,
  "firstName": null,
  "id": null,
  "middleName": null,
  "status": null,
  "suffix": null,
  "surname": null,
  "updatedByEmail": null,
  "updatedByFirstName": null,
  "updatedById": null,
  "updatedBySurname": null,
  "updatedByType": null,
} satisfies MemberTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MemberTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



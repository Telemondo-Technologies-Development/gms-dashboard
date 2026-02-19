
# PersonnelRolePutDTO

Format for Personnel Role update

## Properties

Name | Type
------------ | -------------
`description` | string
`name` | string
`updatedById` | string

## Example

```typescript
import type { PersonnelRolePutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "description": null,
  "name": null,
  "updatedById": null,
} satisfies PersonnelRolePutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PersonnelRolePutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



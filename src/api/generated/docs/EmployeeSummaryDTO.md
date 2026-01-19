
# EmployeeSummaryDTO


## Properties

Name | Type
------------ | -------------
`firstName` | string
`id` | string
`middleName` | string
`suffix` | string
`surname` | string

## Example

```typescript
import type { EmployeeSummaryDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": null,
  "id": null,
  "middleName": null,
  "suffix": null,
  "surname": null,
} satisfies EmployeeSummaryDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeSummaryDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



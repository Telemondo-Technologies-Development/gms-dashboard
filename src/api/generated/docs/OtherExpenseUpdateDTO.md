
# OtherExpenseUpdateDTO

Request body for updating an existing miscellaneous (other) expense record

## Properties

Name | Type
------------ | -------------
`actorId` | string
`amount` | number
`branchId` | string
`objectIds` | Set&lt;string&gt;
`otherExpenseTypeId` | string
`paidAt` | Date

## Example

```typescript
import type { OtherExpenseUpdateDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "amount": null,
  "branchId": null,
  "objectIds": null,
  "otherExpenseTypeId": null,
  "paidAt": null,
} satisfies OtherExpenseUpdateDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OtherExpenseUpdateDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



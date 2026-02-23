
# OtherExpenseReadDTO

Response data representing miscellaneous (other) expense details

## Properties

Name | Type
------------ | -------------
`amount` | number
`branchId` | string
`createdAt` | Date
`id` | string
`objectIds` | Array&lt;string&gt;
`otherExpenseTypeId` | string
`paidAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { OtherExpenseReadDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "branchId": null,
  "createdAt": null,
  "id": null,
  "objectIds": null,
  "otherExpenseTypeId": null,
  "paidAt": null,
  "updatedAt": null,
} satisfies OtherExpenseReadDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OtherExpenseReadDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



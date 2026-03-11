
# SuppliesExpenseReadDTO

Response data representing supplies expense details

## Properties

Name | Type
------------ | -------------
`amount` | number
`branchId` | string
`createdAt` | Date
`id` | string
`objectIds` | Array&lt;string&gt;
`paidAt` | Date
`suppliesLogId` | string
`updatedAt` | Date

## Example

```typescript
import type { SuppliesExpenseReadDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "branchId": null,
  "createdAt": null,
  "id": null,
  "objectIds": null,
  "paidAt": null,
  "suppliesLogId": null,
  "updatedAt": null,
} satisfies SuppliesExpenseReadDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SuppliesExpenseReadDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



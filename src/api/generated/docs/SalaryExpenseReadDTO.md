
# SalaryExpenseReadDTO

Response data representing salary expense details

## Properties

Name | Type
------------ | -------------
`actorId` | string
`amount` | number
`branchId` | string
`createdAt` | Date
`objectIds` | Array&lt;string&gt;
`paidAt` | Date
`period` | Date
`salaryType` | string
`updatedAt` | Date

## Example

```typescript
import type { SalaryExpenseReadDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "amount": null,
  "branchId": null,
  "createdAt": null,
  "objectIds": null,
  "paidAt": null,
  "period": null,
  "salaryType": null,
  "updatedAt": null,
} satisfies SalaryExpenseReadDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SalaryExpenseReadDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



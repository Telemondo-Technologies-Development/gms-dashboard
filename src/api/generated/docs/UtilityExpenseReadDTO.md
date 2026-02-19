
# UtilityExpenseReadDTO

Response data representing utility expense details

## Properties

Name | Type
------------ | -------------
`amount` | number
`branchId` | string
`createdAt` | Date
`id` | string
`meter` | string
`objectIds` | Array&lt;string&gt;
`paidAt` | Date
`period` | Date
`updatedAt` | Date
`utilityTypeId` | string

## Example

```typescript
import type { UtilityExpenseReadDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "branchId": null,
  "createdAt": null,
  "id": null,
  "meter": null,
  "objectIds": null,
  "paidAt": null,
  "period": null,
  "updatedAt": null,
  "utilityTypeId": null,
} satisfies UtilityExpenseReadDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UtilityExpenseReadDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



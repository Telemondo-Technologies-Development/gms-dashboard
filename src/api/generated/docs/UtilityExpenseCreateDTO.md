
# UtilityExpenseCreateDTO

Request body for creating a new utility expense record (e.g., water, electricity)

## Properties

Name | Type
------------ | -------------
`actorId` | string
`amount` | number
`branchId` | string
`meter` | string
`objectIds` | Set&lt;string&gt;
`paidAt` | Date
`period` | Date
`utilityTypeId` | string

## Example

```typescript
import type { UtilityExpenseCreateDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "amount": null,
  "branchId": null,
  "meter": null,
  "objectIds": null,
  "paidAt": null,
  "period": null,
  "utilityTypeId": null,
} satisfies UtilityExpenseCreateDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UtilityExpenseCreateDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



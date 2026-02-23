
# UtilityExpenseUpdateDTO

Request body for updating an existing utility expense record

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
import type { UtilityExpenseUpdateDTO } from ''

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
} satisfies UtilityExpenseUpdateDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UtilityExpenseUpdateDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



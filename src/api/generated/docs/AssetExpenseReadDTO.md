
# AssetExpenseReadDTO

Response data representing an asset expense details

## Properties

Name | Type
------------ | -------------
`amount` | number
`assetId` | string
`branchId` | string
`createdAt` | Date
`id` | string
`objectIds` | Array&lt;string&gt;
`paidAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { AssetExpenseReadDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "assetId": null,
  "branchId": null,
  "createdAt": null,
  "id": null,
  "objectIds": null,
  "paidAt": null,
  "updatedAt": null,
} satisfies AssetExpenseReadDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetExpenseReadDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# AssetExpenseCreateDTO

Request body for creating a new asset expense record

## Properties

Name | Type
------------ | -------------
`actorId` | string
`amount` | number
`assetId` | string
`branchId` | string
`objectIds` | Set&lt;string&gt;
`paidAt` | Date

## Example

```typescript
import type { AssetExpenseCreateDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "amount": null,
  "assetId": null,
  "branchId": null,
  "objectIds": null,
  "paidAt": null,
} satisfies AssetExpenseCreateDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetExpenseCreateDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



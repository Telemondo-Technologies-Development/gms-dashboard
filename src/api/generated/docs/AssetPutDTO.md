
# AssetPutDTO

Format for Asset update

## Properties

Name | Type
------------ | -------------
`assetCategoryId` | string
`branchId` | string
`endOfLife` | Date
`isDateRangeValid` | boolean
`manufacturedDate` | Date
`name` | string
`objectIds` | Array&lt;string&gt;
`remarks` | string
`updatedById` | string

## Example

```typescript
import type { AssetPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "assetCategoryId": null,
  "branchId": null,
  "endOfLife": null,
  "isDateRangeValid": null,
  "manufacturedDate": null,
  "name": null,
  "objectIds": null,
  "remarks": null,
  "updatedById": null,
} satisfies AssetPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# AssetPostDTO

Format for Asset create

## Properties

Name | Type
------------ | -------------
`assetCategoryId` | string
`branchId` | string
`createdById` | string
`endOfLife` | Date
`isDateRangeValid` | boolean
`manufacturedDate` | Date
`name` | string
`objectIds` | Array&lt;string&gt;
`remarks` | string

## Example

```typescript
import type { AssetPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "assetCategoryId": null,
  "branchId": null,
  "createdById": null,
  "endOfLife": null,
  "isDateRangeValid": null,
  "manufacturedDate": null,
  "name": null,
  "objectIds": null,
  "remarks": null,
} satisfies AssetPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



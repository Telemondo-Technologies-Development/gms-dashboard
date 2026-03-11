
# AssetPutDTO

Format for Asset update

## Properties

Name | Type
------------ | -------------
`acquisitionDate` | Date
`assetCategoryId` | string
`branchId` | string
`brandIds` | Array&lt;string&gt;
`endOfLife` | Date
`isAcquisitionDateValid` | boolean
`isEndOfLifeValid` | boolean
`manufacturedDate` | Date
`name` | string
`objectIds` | Array&lt;string&gt;
`remarks` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { AssetPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "acquisitionDate": null,
  "assetCategoryId": null,
  "branchId": null,
  "brandIds": null,
  "endOfLife": null,
  "isAcquisitionDateValid": null,
  "isEndOfLifeValid": null,
  "manufacturedDate": null,
  "name": null,
  "objectIds": null,
  "remarks": null,
  "status": null,
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



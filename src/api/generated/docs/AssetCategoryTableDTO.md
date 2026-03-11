
# AssetCategoryTableDTO

Format for Asset Category read

## Properties

Name | Type
------------ | -------------
`createdAt` | Date
`createdById` | string
`id` | string
`name` | string
`updatedAt` | Date
`updatedById` | string

## Example

```typescript
import type { AssetCategoryTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "createdAt": null,
  "createdById": null,
  "id": null,
  "name": null,
  "updatedAt": null,
  "updatedById": null,
} satisfies AssetCategoryTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetCategoryTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



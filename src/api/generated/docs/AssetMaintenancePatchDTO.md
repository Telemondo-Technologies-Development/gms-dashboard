
# AssetMaintenancePatchDTO

Format for Asset Maintenance Log patch

## Properties

Name | Type
------------ | -------------
`completionDate` | Date
`description` | string
`objectIds` | Array&lt;string&gt;
`status` | string
`updatedById` | string

## Example

```typescript
import type { AssetMaintenancePatchDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "completionDate": null,
  "description": null,
  "objectIds": null,
  "status": null,
  "updatedById": null,
} satisfies AssetMaintenancePatchDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetMaintenancePatchDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



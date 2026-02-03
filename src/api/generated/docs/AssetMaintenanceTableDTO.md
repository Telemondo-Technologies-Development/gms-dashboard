
# AssetMaintenanceTableDTO

Format for Asset Maintenance Log read

## Properties

Name | Type
------------ | -------------
`assetId` | string
`completionDate` | Date
`createdById` | string
`description` | string
`dueDate` | Date
`id` | string
`maintenanceDate` | Date
`maintenanceScheduleId` | string
`objectIds` | Array&lt;string&gt;
`status` | string
`updatedById` | string

## Example

```typescript
import type { AssetMaintenanceTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "assetId": null,
  "completionDate": null,
  "createdById": null,
  "description": null,
  "dueDate": null,
  "id": null,
  "maintenanceDate": null,
  "maintenanceScheduleId": null,
  "objectIds": null,
  "status": null,
  "updatedById": null,
} satisfies AssetMaintenanceTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AssetMaintenanceTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



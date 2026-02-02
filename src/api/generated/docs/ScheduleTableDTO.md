
# ScheduleTableDTO


## Properties

Name | Type
------------ | -------------
`active` | boolean
`assetId` | string
`createdById` | string
`id` | string
`intervalUnit` | string
`intervalValue` | number
`leadTimeHours` | number
`name` | string
`startDate` | Date
`timeToCompleteHours` | number

## Example

```typescript
import type { ScheduleTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "active": null,
  "assetId": null,
  "createdById": null,
  "id": null,
  "intervalUnit": null,
  "intervalValue": null,
  "leadTimeHours": null,
  "name": null,
  "startDate": null,
  "timeToCompleteHours": null,
} satisfies ScheduleTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ScheduleTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



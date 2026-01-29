
# SchedulePostDTO


## Properties

Name | Type
------------ | -------------
`assetId` | string
`createdById` | string
`intervalUnit` | string
`intervalValue` | number
`leadTimeHours` | number
`name` | string
`startDate` | Date
`timeToCompleteHours` | number

## Example

```typescript
import type { SchedulePostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "assetId": null,
  "createdById": null,
  "intervalUnit": null,
  "intervalValue": null,
  "leadTimeHours": null,
  "name": null,
  "startDate": null,
  "timeToCompleteHours": null,
} satisfies SchedulePostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SchedulePostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



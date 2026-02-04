
# SchedulePutDTO


## Properties

Name | Type
------------ | -------------
`active` | boolean
`dayOfWeek` | number
`intervalUnit` | string
`intervalValue` | number
`isAdvancedSettingsAllowed` | boolean
`leadTimeHours` | number
`monthOfYear` | number
`name` | string
`startDate` | Date
`timeToCompleteHours` | number
`updatedById` | string
`weekRank` | number

## Example

```typescript
import type { SchedulePutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "active": null,
  "dayOfWeek": null,
  "intervalUnit": null,
  "intervalValue": null,
  "isAdvancedSettingsAllowed": null,
  "leadTimeHours": null,
  "monthOfYear": null,
  "name": null,
  "startDate": null,
  "timeToCompleteHours": null,
  "updatedById": null,
  "weekRank": null,
} satisfies SchedulePutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SchedulePutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



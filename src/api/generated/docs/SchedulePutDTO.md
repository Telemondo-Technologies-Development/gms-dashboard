
# SchedulePutDTO


## Properties

Name | Type
------------ | -------------
`active` | boolean
`intervalUnit` | string
`intervalValue` | number
`leadTimeHours` | number
`name` | string
`startDate` | Date
`timeToCompleteHours` | number
`updatedById` | string

## Example

```typescript
import type { SchedulePutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "active": null,
  "intervalUnit": null,
  "intervalValue": null,
  "leadTimeHours": null,
  "name": null,
  "startDate": null,
  "timeToCompleteHours": null,
  "updatedById": null,
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



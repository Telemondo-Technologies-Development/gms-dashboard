
# AttendanceTableDTO

Format for Attendance read

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`id` | string
`source` | string
`type` | string
`updatedById` | string

## Example

```typescript
import type { AttendanceTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "id": null,
  "source": null,
  "type": null,
  "updatedById": null,
} satisfies AttendanceTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AttendanceTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



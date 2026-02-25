
# AttendancePostDTO

Format for Attendance create

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`source` | string
`type` | string

## Example

```typescript
import type { AttendancePostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "source": null,
  "type": null,
} satisfies AttendancePostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AttendancePostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



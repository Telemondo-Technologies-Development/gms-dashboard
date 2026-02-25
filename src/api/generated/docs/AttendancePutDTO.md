
# AttendancePutDTO

Format for Attendance update

## Properties

Name | Type
------------ | -------------
`source` | string
`type` | string
`updatedById` | string

## Example

```typescript
import type { AttendancePutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "source": null,
  "type": null,
  "updatedById": null,
} satisfies AttendancePutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AttendancePutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



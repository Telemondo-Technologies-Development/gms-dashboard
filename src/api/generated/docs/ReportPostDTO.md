
# ReportPostDTO

Format for Report create

## Properties

Name | Type
------------ | -------------
`actorId` | string
`branchId` | string
`createdById` | string
`description` | string
`objectIds` | Array&lt;string&gt;
`occurredAt` | Date
`reportTypeId` | string

## Example

```typescript
import type { ReportPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branchId": null,
  "createdById": null,
  "description": null,
  "objectIds": null,
  "occurredAt": null,
  "reportTypeId": null,
} satisfies ReportPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReportPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



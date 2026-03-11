
# ReportTableDTO

Format for Report read

## Properties

Name | Type
------------ | -------------
`actorFirstname` | string
`actorId` | string
`actorStatus` | string
`actorSurname` | string
`branchAddress` | string
`branchId` | string
`branchName` | string
`branchStatus` | string
`createdAt` | Date
`createdByEmail` | string
`createdByFirstName` | string
`createdById` | string
`createdBySurname` | string
`createdByType` | string
`description` | string
`id` | string
`objectIds` | Array&lt;string&gt;
`occurredAt` | Date
`reportTypeId` | string
`updatedAt` | Date
`updatedByEmail` | string
`updatedByFirstName` | string
`updatedById` | string
`updatedBySurname` | string
`updatedByType` | string

## Example

```typescript
import type { ReportTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "actorFirstname": null,
  "actorId": null,
  "actorStatus": null,
  "actorSurname": null,
  "branchAddress": null,
  "branchId": null,
  "branchName": null,
  "branchStatus": null,
  "createdAt": null,
  "createdByEmail": null,
  "createdByFirstName": null,
  "createdById": null,
  "createdBySurname": null,
  "createdByType": null,
  "description": null,
  "id": null,
  "objectIds": null,
  "occurredAt": null,
  "reportTypeId": null,
  "updatedAt": null,
  "updatedByEmail": null,
  "updatedByFirstName": null,
  "updatedById": null,
  "updatedBySurname": null,
  "updatedByType": null,
} satisfies ReportTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ReportTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



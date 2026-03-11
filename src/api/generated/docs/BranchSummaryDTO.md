
# BranchSummaryDTO

Format for Branch read summary

## Properties

Name | Type
------------ | -------------
`address` | string
`id` | string
`latitude` | string
`longitude` | string
`name` | string
`status` | string

## Example

```typescript
import type { BranchSummaryDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "address": null,
  "id": null,
  "latitude": null,
  "longitude": null,
  "name": null,
  "status": null,
} satisfies BranchSummaryDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchSummaryDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



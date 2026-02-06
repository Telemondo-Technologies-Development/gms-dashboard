
# SupplyPutDTO

Format for Supply update

## Properties

Name | Type
------------ | -------------
`branchId` | string
`description` | string
`name` | string
`objectIds` | Array&lt;string&gt;
`updatedById` | string

## Example

```typescript
import type { SupplyPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "branchId": null,
  "description": null,
  "name": null,
  "objectIds": null,
  "updatedById": null,
} satisfies SupplyPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SupplyPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# SupplyPostDTO

Format for Supply create

## Properties

Name | Type
------------ | -------------
`branchId` | string
`createdById` | string
`description` | string
`name` | string
`objectIds` | Array&lt;string&gt;

## Example

```typescript
import type { SupplyPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "branchId": null,
  "createdById": null,
  "description": null,
  "name": null,
  "objectIds": null,
} satisfies SupplyPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SupplyPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



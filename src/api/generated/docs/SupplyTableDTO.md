
# SupplyTableDTO

Format for Supply read

## Properties

Name | Type
------------ | -------------
`branchId` | string
`createdAt` | Date
`createdById` | string
`description` | string
`id` | string
`name` | string
`objectIds` | Array&lt;string&gt;
`quantity` | number
`updatedAt` | Date
`updatedById` | string

## Example

```typescript
import type { SupplyTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "branchId": null,
  "createdAt": null,
  "createdById": null,
  "description": null,
  "id": null,
  "name": null,
  "objectIds": null,
  "quantity": null,
  "updatedAt": null,
  "updatedById": null,
} satisfies SupplyTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SupplyTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



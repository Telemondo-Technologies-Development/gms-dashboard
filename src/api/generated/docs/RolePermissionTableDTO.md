
# RolePermissionTableDTO

Format for Role Permission read

## Properties

Name | Type
------------ | -------------
`createdById` | string
`description` | string
`id` | string
`name` | string
`permissions` | [Array&lt;Permission&gt;](Permission.md)
`updatedById` | string

## Example

```typescript
import type { RolePermissionTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "createdById": null,
  "description": null,
  "id": null,
  "name": null,
  "permissions": null,
  "updatedById": null,
} satisfies RolePermissionTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RolePermissionTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



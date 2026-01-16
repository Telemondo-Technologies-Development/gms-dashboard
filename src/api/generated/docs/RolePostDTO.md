
# RolePostDTO

Format for Role create

## Properties

Name | Type
------------ | -------------
`createdById` | string
`description` | string
`name` | string

## Example

```typescript
import type { RolePostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "createdById": null,
  "description": null,
  "name": null,
} satisfies RolePostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RolePostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# BrandPostDTO

Format for Brand create

## Properties

Name | Type
------------ | -------------
`createdById` | string
`name` | string
`objectIds` | Array&lt;string&gt;

## Example

```typescript
import type { BrandPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "createdById": null,
  "name": null,
  "objectIds": null,
} satisfies BrandPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BrandPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



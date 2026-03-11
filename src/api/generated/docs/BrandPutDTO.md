
# BrandPutDTO

Format for Brand update

## Properties

Name | Type
------------ | -------------
`name` | string
`objectIds` | Array&lt;string&gt;
`updatedById` | string

## Example

```typescript
import type { BrandPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "objectIds": null,
  "updatedById": null,
} satisfies BrandPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BrandPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



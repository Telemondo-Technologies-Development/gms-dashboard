
# UserPostDTO


## Properties

Name | Type
------------ | -------------
`password` | string
`roles` | Array&lt;string&gt;
`username` | string

## Example

```typescript
import type { UserPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "password": null,
  "roles": null,
  "username": null,
} satisfies UserPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)




# LogInResponse


## Properties

Name | Type
------------ | -------------
`actorId` | string
`branches` | [Array&lt;BranchListDTO&gt;](BranchListDTO.md)
`email` | string

## Example

```typescript
import type { LogInResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "actorId": null,
  "branches": null,
  "email": null,
} satisfies LogInResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LogInResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



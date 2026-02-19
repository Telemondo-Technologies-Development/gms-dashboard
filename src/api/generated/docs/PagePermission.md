
# PagePermission


## Properties

Name | Type
------------ | -------------
`content` | [Array&lt;Permission&gt;](Permission.md)
`empty` | boolean
`first` | boolean
`last` | boolean
`number` | number
`numberOfElements` | number
`pageable` | [PageableObject](PageableObject.md)
`size` | number
`sort` | [SortObject](SortObject.md)
`totalElements` | number
`totalPages` | number

## Example

```typescript
import type { PagePermission } from ''

// TODO: Update the object below with actual values
const example = {
  "content": null,
  "empty": null,
  "first": null,
  "last": null,
  "number": null,
  "numberOfElements": null,
  "pageable": null,
  "size": null,
  "sort": null,
  "totalElements": null,
  "totalPages": null,
} satisfies PagePermission

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PagePermission
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



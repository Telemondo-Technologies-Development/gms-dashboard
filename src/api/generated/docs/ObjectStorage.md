
# ObjectStorage


## Properties

Name | Type
------------ | -------------
`bucket` | string
`createdAt` | Date
`createdById` | string
`fileKey` | string
`fileSize` | string
`id` | string
`mimeType` | string
`name` | string
`status` | number
`tags` | string
`updatedAt` | Date
`updatedById` | string

## Example

```typescript
import type { ObjectStorage } from ''

// TODO: Update the object below with actual values
const example = {
  "bucket": null,
  "createdAt": null,
  "createdById": null,
  "fileKey": null,
  "fileSize": null,
  "id": null,
  "mimeType": null,
  "name": null,
  "status": null,
  "tags": null,
  "updatedAt": null,
  "updatedById": null,
} satisfies ObjectStorage

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ObjectStorage
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



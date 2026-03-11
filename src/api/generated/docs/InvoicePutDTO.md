
# InvoicePutDTO

Format for Invoice update

## Properties

Name | Type
------------ | -------------
`dueDate` | Date
`gracePeriodDate` | Date
`status` | string
`subtotal` | number
`updatedById` | string

## Example

```typescript
import type { InvoicePutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "dueDate": null,
  "gracePeriodDate": null,
  "status": null,
  "subtotal": null,
  "updatedById": null,
} satisfies InvoicePutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InvoicePutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



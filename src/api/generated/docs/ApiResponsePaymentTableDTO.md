
# ApiResponsePaymentTableDTO


## Properties

Name | Type
------------ | -------------
`data` | [PaymentTableDTO](PaymentTableDTO.md)
`errors` | [Array&lt;ApiError&gt;](ApiError.md)
`message` | string
`meta` | [PageMetadata](PageMetadata.md)
`success` | boolean
`timestamp` | number

## Example

```typescript
import type { ApiResponsePaymentTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "errors": null,
  "message": null,
  "meta": null,
  "success": null,
  "timestamp": null,
} satisfies ApiResponsePaymentTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiResponsePaymentTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



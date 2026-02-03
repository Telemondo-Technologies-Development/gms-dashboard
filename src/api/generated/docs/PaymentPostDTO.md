
# PaymentPostDTO

Format for Payment create

## Properties

Name | Type
------------ | -------------
`amount` | number
`createdById` | string
`failureReason` | string
`invoiceId` | string
`paidAt` | Date
`paymentMethodId` | string
`referenceNum` | string
`status` | string

## Example

```typescript
import type { PaymentPostDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "createdById": null,
  "failureReason": null,
  "invoiceId": null,
  "paidAt": null,
  "paymentMethodId": null,
  "referenceNum": null,
  "status": null,
} satisfies PaymentPostDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentPostDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



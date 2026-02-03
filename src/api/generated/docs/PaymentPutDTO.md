
# PaymentPutDTO

Format for Payment update

## Properties

Name | Type
------------ | -------------
`amount` | number
`failureReason` | string
`paidAt` | Date
`paymentMethodId` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { PaymentPutDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "failureReason": null,
  "paidAt": null,
  "paymentMethodId": null,
  "status": null,
  "updatedById": null,
} satisfies PaymentPutDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentPutDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



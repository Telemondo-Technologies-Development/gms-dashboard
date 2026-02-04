
# PaymentTableDTO

Format for Payment read

## Properties

Name | Type
------------ | -------------
`amount` | number
`createdById` | string
`failureReason` | string
`id` | string
`invoiceId` | string
`paidAt` | Date
`paymentMethodId` | string
`referenceNum` | string
`status` | string
`updatedById` | string

## Example

```typescript
import type { PaymentTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": null,
  "createdById": null,
  "failureReason": null,
  "id": null,
  "invoiceId": null,
  "paidAt": null,
  "paymentMethodId": null,
  "referenceNum": null,
  "status": null,
  "updatedById": null,
} satisfies PaymentTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



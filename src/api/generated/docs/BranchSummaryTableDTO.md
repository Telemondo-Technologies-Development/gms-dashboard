
# BranchSummaryTableDTO

Format for Branch Summary read

## Properties

Name | Type
------------ | -------------
`avgExpense` | number
`avgInvoice` | number
`branchId` | string
`branchName` | string
`netProfit` | number
`reportMonth` | Date
`reportQuarter` | number
`reportYear` | number
`totalExpenses` | number
`totalRevenue` | number

## Example

```typescript
import type { BranchSummaryTableDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "avgExpense": null,
  "avgInvoice": null,
  "branchId": null,
  "branchName": null,
  "netProfit": null,
  "reportMonth": null,
  "reportQuarter": null,
  "reportYear": null,
  "totalExpenses": null,
  "totalRevenue": null,
} satisfies BranchSummaryTableDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchSummaryTableDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



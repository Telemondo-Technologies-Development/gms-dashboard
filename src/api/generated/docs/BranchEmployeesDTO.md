
# BranchEmployeesDTO

Format for Branch with Personnel read

## Properties

Name | Type
------------ | -------------
`branch` | [BranchSummaryDTO](BranchSummaryDTO.md)
`employees` | [Array&lt;EmployeeInBranchDTO&gt;](EmployeeInBranchDTO.md)

## Example

```typescript
import type { BranchEmployeesDTO } from ''

// TODO: Update the object below with actual values
const example = {
  "branch": null,
  "employees": null,
} satisfies BranchEmployeesDTO

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BranchEmployeesDTO
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)



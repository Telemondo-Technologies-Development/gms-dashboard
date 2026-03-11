# SalaryExpenseApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSalaryExpense**](SalaryExpenseApi.md#createsalaryexpense) | **POST** /api/expense/salary | Create a new Salary Expense |
| [**deleteSalaryExpense**](SalaryExpenseApi.md#deletesalaryexpense) | **DELETE** /api/expense/salary/{id} | Delete a salary Expense by id |
| [**getAllSalaryExpense**](SalaryExpenseApi.md#getallsalaryexpense) | **GET** /api/expense/salary | Get all salary expenses |
| [**getSalaryExpenseById**](SalaryExpenseApi.md#getsalaryexpensebyid) | **GET** /api/expense/salary/{id} | Get salary expense by id |
| [**updateSalaryExpense**](SalaryExpenseApi.md#updatesalaryexpense) | **PUT** /api/expense/salary/{id} | Update an existing Salary Expense by id |



## createSalaryExpense

> ApiResponseSalaryExpenseReadDTO createSalaryExpense(salaryExpenseCreateDTO)

Create a new Salary Expense

### Example

```ts
import {
  Configuration,
  SalaryExpenseApi,
} from '';
import type { CreateSalaryExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SalaryExpenseApi();

  const body = {
    // SalaryExpenseCreateDTO
    salaryExpenseCreateDTO: ...,
  } satisfies CreateSalaryExpenseRequest;

  try {
    const data = await api.createSalaryExpense(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **salaryExpenseCreateDTO** | [SalaryExpenseCreateDTO](SalaryExpenseCreateDTO.md) |  | |

### Return type

[**ApiResponseSalaryExpenseReadDTO**](ApiResponseSalaryExpenseReadDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSalaryExpense

> ApiResponseUnit deleteSalaryExpense(id)

Delete a salary Expense by id

### Example

```ts
import {
  Configuration,
  SalaryExpenseApi,
} from '';
import type { DeleteSalaryExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SalaryExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteSalaryExpenseRequest;

  try {
    const data = await api.deleteSalaryExpense(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ApiResponseUnit**](ApiResponseUnit.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAllSalaryExpense

> ApiResponseListSalaryExpenseReadDTO getAllSalaryExpense(pageable)

Get all salary expenses

### Example

```ts
import {
  Configuration,
  SalaryExpenseApi,
} from '';
import type { GetAllSalaryExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SalaryExpenseApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSalaryExpenseRequest;

  try {
    const data = await api.getAllSalaryExpense(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **pageable** | [](.md) |  | [Defaults to `undefined`] |

### Return type

[**ApiResponseListSalaryExpenseReadDTO**](ApiResponseListSalaryExpenseReadDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSalaryExpenseById

> SalaryExpenseReadDTO getSalaryExpenseById(id)

Get salary expense by id

### Example

```ts
import {
  Configuration,
  SalaryExpenseApi,
} from '';
import type { GetSalaryExpenseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SalaryExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetSalaryExpenseByIdRequest;

  try {
    const data = await api.getSalaryExpenseById(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**SalaryExpenseReadDTO**](SalaryExpenseReadDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateSalaryExpense

> ApiResponseSalaryExpenseReadDTO updateSalaryExpense(id, salaryExpenseUpdateDTO)

Update an existing Salary Expense by id

### Example

```ts
import {
  Configuration,
  SalaryExpenseApi,
} from '';
import type { UpdateSalaryExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SalaryExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // SalaryExpenseUpdateDTO
    salaryExpenseUpdateDTO: ...,
  } satisfies UpdateSalaryExpenseRequest;

  try {
    const data = await api.updateSalaryExpense(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **salaryExpenseUpdateDTO** | [SalaryExpenseUpdateDTO](SalaryExpenseUpdateDTO.md) |  | |

### Return type

[**ApiResponseSalaryExpenseReadDTO**](ApiResponseSalaryExpenseReadDTO.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


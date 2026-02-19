# SuppliesExpenseApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSuppliesExpense**](SuppliesExpenseApi.md#createsuppliesexpense) | **POST** /api/expense/supply | Create a supplies expense |
| [**deleteSuppliesExpense**](SuppliesExpenseApi.md#deletesuppliesexpense) | **DELETE** /api/expense/supply/{id} | Delete a supplies expense by ID |
| [**getAllSuppliesExpense**](SuppliesExpenseApi.md#getallsuppliesexpense) | **GET** /api/expense/supply | Get all supplies expenses |
| [**getSuppliesExpenseById**](SuppliesExpenseApi.md#getsuppliesexpensebyid) | **GET** /api/expense/supply/{id} | Get a supplies expense by ID |
| [**updateSuppliesExpense**](SuppliesExpenseApi.md#updatesuppliesexpense) | **PUT** /api/expense/supply/{id} | Update a supplies expense by ID |



## createSuppliesExpense

> ApiResponseSuppliesExpenseReadDTO createSuppliesExpense(suppliesExpenseCreateDTO)

Create a supplies expense

### Example

```ts
import {
  Configuration,
  SuppliesExpenseApi,
} from '';
import type { CreateSuppliesExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesExpenseApi();

  const body = {
    // SuppliesExpenseCreateDTO
    suppliesExpenseCreateDTO: ...,
  } satisfies CreateSuppliesExpenseRequest;

  try {
    const data = await api.createSuppliesExpense(body);
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
| **suppliesExpenseCreateDTO** | [SuppliesExpenseCreateDTO](SuppliesExpenseCreateDTO.md) |  | |

### Return type

[**ApiResponseSuppliesExpenseReadDTO**](ApiResponseSuppliesExpenseReadDTO.md)

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


## deleteSuppliesExpense

> ApiResponseUnit deleteSuppliesExpense(id)

Delete a supplies expense by ID

### Example

```ts
import {
  Configuration,
  SuppliesExpenseApi,
} from '';
import type { DeleteSuppliesExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteSuppliesExpenseRequest;

  try {
    const data = await api.deleteSuppliesExpense(body);
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


## getAllSuppliesExpense

> ApiResponseListSuppliesExpenseReadDTO getAllSuppliesExpense(pageable)

Get all supplies expenses

### Example

```ts
import {
  Configuration,
  SuppliesExpenseApi,
} from '';
import type { GetAllSuppliesExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesExpenseApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSuppliesExpenseRequest;

  try {
    const data = await api.getAllSuppliesExpense(body);
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

[**ApiResponseListSuppliesExpenseReadDTO**](ApiResponseListSuppliesExpenseReadDTO.md)

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


## getSuppliesExpenseById

> SuppliesExpenseReadDTO getSuppliesExpenseById(id)

Get a supplies expense by ID

### Example

```ts
import {
  Configuration,
  SuppliesExpenseApi,
} from '';
import type { GetSuppliesExpenseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetSuppliesExpenseByIdRequest;

  try {
    const data = await api.getSuppliesExpenseById(body);
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

[**SuppliesExpenseReadDTO**](SuppliesExpenseReadDTO.md)

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


## updateSuppliesExpense

> ApiResponseSuppliesExpenseReadDTO updateSuppliesExpense(id, suppliesExpenseUpdateDTO)

Update a supplies expense by ID

### Example

```ts
import {
  Configuration,
  SuppliesExpenseApi,
} from '';
import type { UpdateSuppliesExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // SuppliesExpenseUpdateDTO
    suppliesExpenseUpdateDTO: ...,
  } satisfies UpdateSuppliesExpenseRequest;

  try {
    const data = await api.updateSuppliesExpense(body);
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
| **suppliesExpenseUpdateDTO** | [SuppliesExpenseUpdateDTO](SuppliesExpenseUpdateDTO.md) |  | |

### Return type

[**ApiResponseSuppliesExpenseReadDTO**](ApiResponseSuppliesExpenseReadDTO.md)

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


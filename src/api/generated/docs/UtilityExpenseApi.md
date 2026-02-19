# UtilityExpenseApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createUtilityExpense**](UtilityExpenseApi.md#createutilityexpense) | **POST** /api/expense/utility | Create a utility expense |
| [**deleteUtilityExpense**](UtilityExpenseApi.md#deleteutilityexpense) | **DELETE** /api/expense/utility/{id} | Delete a utility expense by ID |
| [**getAllUtilityExpense**](UtilityExpenseApi.md#getallutilityexpense) | **GET** /api/expense/utility | Get all utility expenses |
| [**getUtilityExpenseById**](UtilityExpenseApi.md#getutilityexpensebyid) | **GET** /api/expense/utility/{id} | Get a utility expense by ID |
| [**updateUtilityExpense**](UtilityExpenseApi.md#updateutilityexpense) | **PUT** /api/expense/utility/{id} | Update a utility expense by ID |



## createUtilityExpense

> ApiResponseUtilityExpenseReadDTO createUtilityExpense(utilityExpenseCreateDTO)

Create a utility expense

### Example

```ts
import {
  Configuration,
  UtilityExpenseApi,
} from '';
import type { CreateUtilityExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UtilityExpenseApi();

  const body = {
    // UtilityExpenseCreateDTO
    utilityExpenseCreateDTO: ...,
  } satisfies CreateUtilityExpenseRequest;

  try {
    const data = await api.createUtilityExpense(body);
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
| **utilityExpenseCreateDTO** | [UtilityExpenseCreateDTO](UtilityExpenseCreateDTO.md) |  | |

### Return type

[**ApiResponseUtilityExpenseReadDTO**](ApiResponseUtilityExpenseReadDTO.md)

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


## deleteUtilityExpense

> ApiResponseUnit deleteUtilityExpense(id)

Delete a utility expense by ID

### Example

```ts
import {
  Configuration,
  UtilityExpenseApi,
} from '';
import type { DeleteUtilityExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UtilityExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteUtilityExpenseRequest;

  try {
    const data = await api.deleteUtilityExpense(body);
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


## getAllUtilityExpense

> ApiResponseListUtilityExpenseReadDTO getAllUtilityExpense(pageable)

Get all utility expenses

### Example

```ts
import {
  Configuration,
  UtilityExpenseApi,
} from '';
import type { GetAllUtilityExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UtilityExpenseApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllUtilityExpenseRequest;

  try {
    const data = await api.getAllUtilityExpense(body);
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

[**ApiResponseListUtilityExpenseReadDTO**](ApiResponseListUtilityExpenseReadDTO.md)

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


## getUtilityExpenseById

> UtilityExpenseReadDTO getUtilityExpenseById(id)

Get a utility expense by ID

### Example

```ts
import {
  Configuration,
  UtilityExpenseApi,
} from '';
import type { GetUtilityExpenseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UtilityExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetUtilityExpenseByIdRequest;

  try {
    const data = await api.getUtilityExpenseById(body);
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

[**UtilityExpenseReadDTO**](UtilityExpenseReadDTO.md)

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


## updateUtilityExpense

> ApiResponseUtilityExpenseReadDTO updateUtilityExpense(id, utilityExpenseUpdateDTO)

Update a utility expense by ID

### Example

```ts
import {
  Configuration,
  UtilityExpenseApi,
} from '';
import type { UpdateUtilityExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UtilityExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // UtilityExpenseUpdateDTO
    utilityExpenseUpdateDTO: ...,
  } satisfies UpdateUtilityExpenseRequest;

  try {
    const data = await api.updateUtilityExpense(body);
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
| **utilityExpenseUpdateDTO** | [UtilityExpenseUpdateDTO](UtilityExpenseUpdateDTO.md) |  | |

### Return type

[**ApiResponseUtilityExpenseReadDTO**](ApiResponseUtilityExpenseReadDTO.md)

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


# OtherExpenseApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createOtherExpense**](OtherExpenseApi.md#createotherexpense) | **POST** /api/expense/other | Create an other expense |
| [**deleteOtherExpense**](OtherExpenseApi.md#deleteotherexpense) | **DELETE** /api/expense/other/{id} | Delete an other expense by ID |
| [**getAllOtherExpense**](OtherExpenseApi.md#getallotherexpense) | **GET** /api/expense/other | Get all other expenses |
| [**getOtherExpenseById**](OtherExpenseApi.md#getotherexpensebyid) | **GET** /api/expense/other/{id} | Get an other expense by ID |
| [**updateOtherExpense**](OtherExpenseApi.md#updateotherexpense) | **PUT** /api/expense/other/{id} | Update an other expense by ID |



## createOtherExpense

> ApiResponseOtherExpenseReadDTO createOtherExpense(otherExpenseCreateDTO)

Create an other expense

### Example

```ts
import {
  Configuration,
  OtherExpenseApi,
} from '';
import type { CreateOtherExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtherExpenseApi();

  const body = {
    // OtherExpenseCreateDTO
    otherExpenseCreateDTO: ...,
  } satisfies CreateOtherExpenseRequest;

  try {
    const data = await api.createOtherExpense(body);
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
| **otherExpenseCreateDTO** | [OtherExpenseCreateDTO](OtherExpenseCreateDTO.md) |  | |

### Return type

[**ApiResponseOtherExpenseReadDTO**](ApiResponseOtherExpenseReadDTO.md)

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


## deleteOtherExpense

> ApiResponseUnit deleteOtherExpense(id)

Delete an other expense by ID

### Example

```ts
import {
  Configuration,
  OtherExpenseApi,
} from '';
import type { DeleteOtherExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtherExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteOtherExpenseRequest;

  try {
    const data = await api.deleteOtherExpense(body);
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


## getAllOtherExpense

> ApiResponseListOtherExpenseReadDTO getAllOtherExpense(pageable)

Get all other expenses

### Example

```ts
import {
  Configuration,
  OtherExpenseApi,
} from '';
import type { GetAllOtherExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtherExpenseApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllOtherExpenseRequest;

  try {
    const data = await api.getAllOtherExpense(body);
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

[**ApiResponseListOtherExpenseReadDTO**](ApiResponseListOtherExpenseReadDTO.md)

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


## getOtherExpenseById

> OtherExpenseReadDTO getOtherExpenseById(id)

Get an other expense by ID

### Example

```ts
import {
  Configuration,
  OtherExpenseApi,
} from '';
import type { GetOtherExpenseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtherExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetOtherExpenseByIdRequest;

  try {
    const data = await api.getOtherExpenseById(body);
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

[**OtherExpenseReadDTO**](OtherExpenseReadDTO.md)

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


## updateOtherExpense

> ApiResponseOtherExpenseReadDTO updateOtherExpense(id, otherExpenseUpdateDTO)

Update an other expense by ID

### Example

```ts
import {
  Configuration,
  OtherExpenseApi,
} from '';
import type { UpdateOtherExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtherExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // OtherExpenseUpdateDTO
    otherExpenseUpdateDTO: ...,
  } satisfies UpdateOtherExpenseRequest;

  try {
    const data = await api.updateOtherExpense(body);
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
| **otherExpenseUpdateDTO** | [OtherExpenseUpdateDTO](OtherExpenseUpdateDTO.md) |  | |

### Return type

[**ApiResponseOtherExpenseReadDTO**](ApiResponseOtherExpenseReadDTO.md)

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


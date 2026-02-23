# AssetExpenseApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createAssetExpense**](AssetExpenseApi.md#createassetexpense) | **POST** /api/expense/asset | Create an asset expense |
| [**deleteAssetExpense**](AssetExpenseApi.md#deleteassetexpense) | **DELETE** /api/expense/asset/{id} | Delet an asset expense by ID |
| [**getAllAssetExpense**](AssetExpenseApi.md#getallassetexpense) | **GET** /api/expense/asset | Get all asset expenses |
| [**getAssetExpenseById**](AssetExpenseApi.md#getassetexpensebyid) | **GET** /api/expense/asset/{id} | Get an asset expense by ID |
| [**updateAssetExpense**](AssetExpenseApi.md#updateassetexpense) | **PUT** /api/expense/asset/{id} | Update an asset expense by ID |



## createAssetExpense

> ApiResponseAssetExpenseReadDTO createAssetExpense(assetExpenseCreateDTO)

Create an asset expense

### Example

```ts
import {
  Configuration,
  AssetExpenseApi,
} from '';
import type { CreateAssetExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetExpenseApi();

  const body = {
    // AssetExpenseCreateDTO
    assetExpenseCreateDTO: ...,
  } satisfies CreateAssetExpenseRequest;

  try {
    const data = await api.createAssetExpense(body);
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
| **assetExpenseCreateDTO** | [AssetExpenseCreateDTO](AssetExpenseCreateDTO.md) |  | |

### Return type

[**ApiResponseAssetExpenseReadDTO**](ApiResponseAssetExpenseReadDTO.md)

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


## deleteAssetExpense

> ApiResponseUnit deleteAssetExpense(id)

Delet an asset expense by ID

### Example

```ts
import {
  Configuration,
  AssetExpenseApi,
} from '';
import type { DeleteAssetExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteAssetExpenseRequest;

  try {
    const data = await api.deleteAssetExpense(body);
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


## getAllAssetExpense

> ApiResponseListAssetExpenseReadDTO getAllAssetExpense(pageable)

Get all asset expenses

### Example

```ts
import {
  Configuration,
  AssetExpenseApi,
} from '';
import type { GetAllAssetExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetExpenseApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllAssetExpenseRequest;

  try {
    const data = await api.getAllAssetExpense(body);
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

[**ApiResponseListAssetExpenseReadDTO**](ApiResponseListAssetExpenseReadDTO.md)

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


## getAssetExpenseById

> AssetExpenseReadDTO getAssetExpenseById(id)

Get an asset expense by ID

### Example

```ts
import {
  Configuration,
  AssetExpenseApi,
} from '';
import type { GetAssetExpenseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetAssetExpenseByIdRequest;

  try {
    const data = await api.getAssetExpenseById(body);
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

[**AssetExpenseReadDTO**](AssetExpenseReadDTO.md)

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


## updateAssetExpense

> ApiResponseAssetExpenseReadDTO updateAssetExpense(id, assetExpenseUpdateDTO)

Update an asset expense by ID

### Example

```ts
import {
  Configuration,
  AssetExpenseApi,
} from '';
import type { UpdateAssetExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // AssetExpenseUpdateDTO
    assetExpenseUpdateDTO: ...,
  } satisfies UpdateAssetExpenseRequest;

  try {
    const data = await api.updateAssetExpense(body);
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
| **assetExpenseUpdateDTO** | [AssetExpenseUpdateDTO](AssetExpenseUpdateDTO.md) |  | |

### Return type

[**ApiResponseAssetExpenseReadDTO**](ApiResponseAssetExpenseReadDTO.md)

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


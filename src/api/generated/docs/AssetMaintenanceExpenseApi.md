# AssetMaintenanceExpenseApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createAssetMaintenanceExpense**](AssetMaintenanceExpenseApi.md#createassetmaintenanceexpense) | **POST** /api/expense/assetMaintenance | Create an asset maintenance expense |
| [**deleteAssetMaintenanceExpense**](AssetMaintenanceExpenseApi.md#deleteassetmaintenanceexpense) | **DELETE** /api/expense/assetMaintenance/{id} | Delete an asset maintenance expense by ID |
| [**getAllAssetMaintenanceExpense**](AssetMaintenanceExpenseApi.md#getallassetmaintenanceexpense) | **GET** /api/expense/assetMaintenance | Get all asset maintenance expenses |
| [**getAssetMaintenanceExpenseById**](AssetMaintenanceExpenseApi.md#getassetmaintenanceexpensebyid) | **GET** /api/expense/assetMaintenance/{id} | Get an asset maintenance expense by ID |
| [**updateAssetMaintenanceExpense**](AssetMaintenanceExpenseApi.md#updateassetmaintenanceexpense) | **PUT** /api/expense/assetMaintenance/{id} | Update an asset maintenance expense by ID |



## createAssetMaintenanceExpense

> ApiResponseAssetMaintenanceExpenseReadDTO createAssetMaintenanceExpense(assetMaintenanceExpenseCreateDTO)

Create an asset maintenance expense

### Example

```ts
import {
  Configuration,
  AssetMaintenanceExpenseApi,
} from '';
import type { CreateAssetMaintenanceExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceExpenseApi();

  const body = {
    // AssetMaintenanceExpenseCreateDTO
    assetMaintenanceExpenseCreateDTO: ...,
  } satisfies CreateAssetMaintenanceExpenseRequest;

  try {
    const data = await api.createAssetMaintenanceExpense(body);
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
| **assetMaintenanceExpenseCreateDTO** | [AssetMaintenanceExpenseCreateDTO](AssetMaintenanceExpenseCreateDTO.md) |  | |

### Return type

[**ApiResponseAssetMaintenanceExpenseReadDTO**](ApiResponseAssetMaintenanceExpenseReadDTO.md)

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


## deleteAssetMaintenanceExpense

> ApiResponseUnit deleteAssetMaintenanceExpense(id)

Delete an asset maintenance expense by ID

### Example

```ts
import {
  Configuration,
  AssetMaintenanceExpenseApi,
} from '';
import type { DeleteAssetMaintenanceExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteAssetMaintenanceExpenseRequest;

  try {
    const data = await api.deleteAssetMaintenanceExpense(body);
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


## getAllAssetMaintenanceExpense

> ApiResponseListAssetMaintenanceExpenseReadDTO getAllAssetMaintenanceExpense(pageable)

Get all asset maintenance expenses

### Example

```ts
import {
  Configuration,
  AssetMaintenanceExpenseApi,
} from '';
import type { GetAllAssetMaintenanceExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceExpenseApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllAssetMaintenanceExpenseRequest;

  try {
    const data = await api.getAllAssetMaintenanceExpense(body);
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

[**ApiResponseListAssetMaintenanceExpenseReadDTO**](ApiResponseListAssetMaintenanceExpenseReadDTO.md)

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


## getAssetMaintenanceExpenseById

> AssetMaintenanceExpenseReadDTO getAssetMaintenanceExpenseById(id)

Get an asset maintenance expense by ID

### Example

```ts
import {
  Configuration,
  AssetMaintenanceExpenseApi,
} from '';
import type { GetAssetMaintenanceExpenseByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetAssetMaintenanceExpenseByIdRequest;

  try {
    const data = await api.getAssetMaintenanceExpenseById(body);
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

[**AssetMaintenanceExpenseReadDTO**](AssetMaintenanceExpenseReadDTO.md)

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


## updateAssetMaintenanceExpense

> ApiResponseAssetMaintenanceExpenseReadDTO updateAssetMaintenanceExpense(id, assetMaintenanceExpenseUpdateDTO)

Update an asset maintenance expense by ID

### Example

```ts
import {
  Configuration,
  AssetMaintenanceExpenseApi,
} from '';
import type { UpdateAssetMaintenanceExpenseRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceExpenseApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // AssetMaintenanceExpenseUpdateDTO
    assetMaintenanceExpenseUpdateDTO: ...,
  } satisfies UpdateAssetMaintenanceExpenseRequest;

  try {
    const data = await api.updateAssetMaintenanceExpense(body);
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
| **assetMaintenanceExpenseUpdateDTO** | [AssetMaintenanceExpenseUpdateDTO](AssetMaintenanceExpenseUpdateDTO.md) |  | |

### Return type

[**ApiResponseAssetMaintenanceExpenseReadDTO**](ApiResponseAssetMaintenanceExpenseReadDTO.md)

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


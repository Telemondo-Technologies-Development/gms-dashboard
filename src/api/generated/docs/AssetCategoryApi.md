# AssetCategoryApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createAssetCategory**](AssetCategoryApi.md#createassetcategory) | **POST** /api/asset/category | Create an Asset Category |
| [**deleteAssetCategory**](AssetCategoryApi.md#deleteassetcategory) | **DELETE** /api/asset/category/{id} | Delete an Asset Category by id |
| [**getAllAssetCategories**](AssetCategoryApi.md#getallassetcategories) | **GET** /api/asset/category | Get all Asset Categories |
| [**getAssetCategory**](AssetCategoryApi.md#getassetcategory) | **GET** /api/asset/category/{id} | Get an Asset Category by id |
| [**updateAssetCategory**](AssetCategoryApi.md#updateassetcategory) | **PUT** /api/asset/category/{id} | Update an Asset Category by id |



## createAssetCategory

> ApiResponseAssetCategoryTableDTO createAssetCategory(assetCategoryPostDTO)

Create an Asset Category

### Example

```ts
import {
  Configuration,
  AssetCategoryApi,
} from '';
import type { CreateAssetCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetCategoryApi();

  const body = {
    // AssetCategoryPostDTO
    assetCategoryPostDTO: ...,
  } satisfies CreateAssetCategoryRequest;

  try {
    const data = await api.createAssetCategory(body);
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
| **assetCategoryPostDTO** | [AssetCategoryPostDTO](AssetCategoryPostDTO.md) |  | |

### Return type

[**ApiResponseAssetCategoryTableDTO**](ApiResponseAssetCategoryTableDTO.md)

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


## deleteAssetCategory

> ApiResponseUnit deleteAssetCategory(id)

Delete an Asset Category by id

### Example

```ts
import {
  Configuration,
  AssetCategoryApi,
} from '';
import type { DeleteAssetCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetCategoryApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteAssetCategoryRequest;

  try {
    const data = await api.deleteAssetCategory(body);
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


## getAllAssetCategories

> ApiResponseListAssetCategoryTableDTO getAllAssetCategories()

Get all Asset Categories

### Example

```ts
import {
  Configuration,
  AssetCategoryApi,
} from '';
import type { GetAllAssetCategoriesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetCategoryApi();

  try {
    const data = await api.getAllAssetCategories();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiResponseListAssetCategoryTableDTO**](ApiResponseListAssetCategoryTableDTO.md)

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


## getAssetCategory

> ApiResponseAssetCategoryTableDTO getAssetCategory(id)

Get an Asset Category by id

### Example

```ts
import {
  Configuration,
  AssetCategoryApi,
} from '';
import type { GetAssetCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetCategoryApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetAssetCategoryRequest;

  try {
    const data = await api.getAssetCategory(body);
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

[**ApiResponseAssetCategoryTableDTO**](ApiResponseAssetCategoryTableDTO.md)

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


## updateAssetCategory

> ApiResponseAssetCategoryTableDTO updateAssetCategory(id, assetCategoryPutDTO)

Update an Asset Category by id

### Example

```ts
import {
  Configuration,
  AssetCategoryApi,
} from '';
import type { UpdateAssetCategoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetCategoryApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // AssetCategoryPutDTO
    assetCategoryPutDTO: ...,
  } satisfies UpdateAssetCategoryRequest;

  try {
    const data = await api.updateAssetCategory(body);
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
| **assetCategoryPutDTO** | [AssetCategoryPutDTO](AssetCategoryPutDTO.md) |  | |

### Return type

[**ApiResponseAssetCategoryTableDTO**](ApiResponseAssetCategoryTableDTO.md)

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


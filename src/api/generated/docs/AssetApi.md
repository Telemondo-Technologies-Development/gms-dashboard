# AssetApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createAsset**](AssetApi.md#createasset) | **POST** /api/asset | Create an asset |
| [**deleteAsset**](AssetApi.md#deleteasset) | **DELETE** /api/asset/{id} | Delete an asset by ID |
| [**getAllAssets**](AssetApi.md#getallassets) | **GET** /api/asset | Get all assets |
| [**getAsset**](AssetApi.md#getasset) | **GET** /api/asset/{id} | Get an asset by ID |
| [**updateAsset**](AssetApi.md#updateasset) | **PUT** /api/asset/{id} | Update an asset by ID |



## createAsset

> ApiResponseAssetTableDTO createAsset(assetPostDTO)

Create an asset

### Example

```ts
import {
  Configuration,
  AssetApi,
} from '';
import type { CreateAssetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetApi();

  const body = {
    // AssetPostDTO
    assetPostDTO: ...,
  } satisfies CreateAssetRequest;

  try {
    const data = await api.createAsset(body);
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
| **assetPostDTO** | [AssetPostDTO](AssetPostDTO.md) |  | |

### Return type

[**ApiResponseAssetTableDTO**](ApiResponseAssetTableDTO.md)

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


## deleteAsset

> ApiResponseUnit deleteAsset(id)

Delete an asset by ID

### Example

```ts
import {
  Configuration,
  AssetApi,
} from '';
import type { DeleteAssetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteAssetRequest;

  try {
    const data = await api.deleteAsset(body);
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


## getAllAssets

> ApiResponseListAssetTableDTO getAllAssets(pageable)

Get all assets

### Example

```ts
import {
  Configuration,
  AssetApi,
} from '';
import type { GetAllAssetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllAssetsRequest;

  try {
    const data = await api.getAllAssets(body);
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

[**ApiResponseListAssetTableDTO**](ApiResponseListAssetTableDTO.md)

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


## getAsset

> ApiResponseAssetTableDTO getAsset(id)

Get an asset by ID

### Example

```ts
import {
  Configuration,
  AssetApi,
} from '';
import type { GetAssetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetAssetRequest;

  try {
    const data = await api.getAsset(body);
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

[**ApiResponseAssetTableDTO**](ApiResponseAssetTableDTO.md)

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


## updateAsset

> ApiResponseAssetTableDTO updateAsset(id, assetPutDTO)

Update an asset by ID

### Example

```ts
import {
  Configuration,
  AssetApi,
} from '';
import type { UpdateAssetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // AssetPutDTO
    assetPutDTO: ...,
  } satisfies UpdateAssetRequest;

  try {
    const data = await api.updateAsset(body);
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
| **assetPutDTO** | [AssetPutDTO](AssetPutDTO.md) |  | |

### Return type

[**ApiResponseAssetTableDTO**](ApiResponseAssetTableDTO.md)

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


# AssetMaintenanceApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAllMaintenance**](AssetMaintenanceApi.md#getallmaintenance) | **GET** /api/asset/maintenance | Get all Asset Maintenances |
| [**getMaintenanceById**](AssetMaintenanceApi.md#getmaintenancebyid) | **GET** /api/asset/maintenance/{id} | Get an Asset Maintenance by id |
| [**updateMaintenanceStatus**](AssetMaintenanceApi.md#updatemaintenancestatus) | **PATCH** /api/asset/maintenance/{id} | Update an Asset Maintenance status, description, files, and completion date by id |



## getAllMaintenance

> ApiResponseListAssetMaintenanceTableDTO getAllMaintenance(pageable)

Get all Asset Maintenances

### Example

```ts
import {
  Configuration,
  AssetMaintenanceApi,
} from '';
import type { GetAllMaintenanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllMaintenanceRequest;

  try {
    const data = await api.getAllMaintenance(body);
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

[**ApiResponseListAssetMaintenanceTableDTO**](ApiResponseListAssetMaintenanceTableDTO.md)

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


## getMaintenanceById

> ApiResponseAssetMaintenanceTableDTO getMaintenanceById(id)

Get an Asset Maintenance by id

### Example

```ts
import {
  Configuration,
  AssetMaintenanceApi,
} from '';
import type { GetMaintenanceByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetMaintenanceByIdRequest;

  try {
    const data = await api.getMaintenanceById(body);
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

[**ApiResponseAssetMaintenanceTableDTO**](ApiResponseAssetMaintenanceTableDTO.md)

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


## updateMaintenanceStatus

> ApiResponseAssetMaintenanceTableDTO updateMaintenanceStatus(id, assetMaintenancePatchDTO)

Update an Asset Maintenance status, description, files, and completion date by id

### Example

```ts
import {
  Configuration,
  AssetMaintenanceApi,
} from '';
import type { UpdateMaintenanceStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AssetMaintenanceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // AssetMaintenancePatchDTO
    assetMaintenancePatchDTO: ...,
  } satisfies UpdateMaintenanceStatusRequest;

  try {
    const data = await api.updateMaintenanceStatus(body);
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
| **assetMaintenancePatchDTO** | [AssetMaintenancePatchDTO](AssetMaintenancePatchDTO.md) |  | |

### Return type

[**ApiResponseAssetMaintenanceTableDTO**](ApiResponseAssetMaintenanceTableDTO.md)

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


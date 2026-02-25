# SuppliesLogsApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSuppliesLog**](SuppliesLogsApi.md#createsupplieslog) | **POST** /api/supply/log | Create a Supplies Log |
| [**deleteSuppliesLog**](SuppliesLogsApi.md#deletesupplieslog) | **DELETE** /api/supply/log/{id} | Delete a Supplies Log by id |
| [**getAllSuppliesLogs**](SuppliesLogsApi.md#getallsupplieslogs) | **GET** /api/supply/log | Get all Supplies Logs |
| [**getSuppliesLog**](SuppliesLogsApi.md#getsupplieslog) | **GET** /api/supply/log/{id} | Get a Supplies Log by id |
| [**updateSupply1**](SuppliesLogsApi.md#updatesupply1) | **PUT** /api/supply/log/{id} | Update a Supplies Log by id |



## createSuppliesLog

> ApiResponseSuppliesLogTableDTO createSuppliesLog(suppliesLogPostDTO)

Create a Supplies Log

### Example

```ts
import {
  Configuration,
  SuppliesLogsApi,
} from '';
import type { CreateSuppliesLogRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesLogsApi();

  const body = {
    // SuppliesLogPostDTO
    suppliesLogPostDTO: ...,
  } satisfies CreateSuppliesLogRequest;

  try {
    const data = await api.createSuppliesLog(body);
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
| **suppliesLogPostDTO** | [SuppliesLogPostDTO](SuppliesLogPostDTO.md) |  | |

### Return type

[**ApiResponseSuppliesLogTableDTO**](ApiResponseSuppliesLogTableDTO.md)

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


## deleteSuppliesLog

> ApiResponseUnit deleteSuppliesLog(id)

Delete a Supplies Log by id

### Example

```ts
import {
  Configuration,
  SuppliesLogsApi,
} from '';
import type { DeleteSuppliesLogRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesLogsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteSuppliesLogRequest;

  try {
    const data = await api.deleteSuppliesLog(body);
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


## getAllSuppliesLogs

> ApiResponseListSuppliesLogTableDTO getAllSuppliesLogs(pageable)

Get all Supplies Logs

### Example

```ts
import {
  Configuration,
  SuppliesLogsApi,
} from '';
import type { GetAllSuppliesLogsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesLogsApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSuppliesLogsRequest;

  try {
    const data = await api.getAllSuppliesLogs(body);
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

[**ApiResponseListSuppliesLogTableDTO**](ApiResponseListSuppliesLogTableDTO.md)

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


## getSuppliesLog

> ApiResponseSuppliesLogTableDTO getSuppliesLog(id)

Get a Supplies Log by id

### Example

```ts
import {
  Configuration,
  SuppliesLogsApi,
} from '';
import type { GetSuppliesLogRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesLogsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetSuppliesLogRequest;

  try {
    const data = await api.getSuppliesLog(body);
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

[**ApiResponseSuppliesLogTableDTO**](ApiResponseSuppliesLogTableDTO.md)

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


## updateSupply1

> ApiResponseSuppliesLogTableDTO updateSupply1(id, suppliesLogPutDTO)

Update a Supplies Log by id

### Example

```ts
import {
  Configuration,
  SuppliesLogsApi,
} from '';
import type { UpdateSupply1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesLogsApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // SuppliesLogPutDTO
    suppliesLogPutDTO: ...,
  } satisfies UpdateSupply1Request;

  try {
    const data = await api.updateSupply1(body);
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
| **suppliesLogPutDTO** | [SuppliesLogPutDTO](SuppliesLogPutDTO.md) |  | |

### Return type

[**ApiResponseSuppliesLogTableDTO**](ApiResponseSuppliesLogTableDTO.md)

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


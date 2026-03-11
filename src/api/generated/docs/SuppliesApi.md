# SuppliesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSupply**](SuppliesApi.md#createsupply) | **POST** /api/supply | Create a Supply |
| [**deleteSupply**](SuppliesApi.md#deletesupply) | **DELETE** /api/supply/{id} | Delete a Supply by id |
| [**getAllSupplies**](SuppliesApi.md#getallsupplies) | **GET** /api/supply | Get all Supplies |
| [**getSupply**](SuppliesApi.md#getsupply) | **GET** /api/supply/{id} | Get a Supply by id |
| [**getSupplyLogs**](SuppliesApi.md#getsupplylogs) | **GET** /api/supply/{id}/log | Get Supply Logs by Supply ID |
| [**updateSupply**](SuppliesApi.md#updatesupply) | **PUT** /api/supply/{id} | Update a Supply by id |



## createSupply

> ApiResponseSupplyTableDTO createSupply(supplyPostDTO)

Create a Supply

### Example

```ts
import {
  Configuration,
  SuppliesApi,
} from '';
import type { CreateSupplyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesApi();

  const body = {
    // SupplyPostDTO
    supplyPostDTO: ...,
  } satisfies CreateSupplyRequest;

  try {
    const data = await api.createSupply(body);
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
| **supplyPostDTO** | [SupplyPostDTO](SupplyPostDTO.md) |  | |

### Return type

[**ApiResponseSupplyTableDTO**](ApiResponseSupplyTableDTO.md)

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


## deleteSupply

> ApiResponseUnit deleteSupply(id)

Delete a Supply by id

### Example

```ts
import {
  Configuration,
  SuppliesApi,
} from '';
import type { DeleteSupplyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteSupplyRequest;

  try {
    const data = await api.deleteSupply(body);
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


## getAllSupplies

> ApiResponseListSupplyTableDTO getAllSupplies(pageable)

Get all Supplies

### Example

```ts
import {
  Configuration,
  SuppliesApi,
} from '';
import type { GetAllSuppliesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSuppliesRequest;

  try {
    const data = await api.getAllSupplies(body);
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

[**ApiResponseListSupplyTableDTO**](ApiResponseListSupplyTableDTO.md)

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


## getSupply

> ApiResponseSupplyTableDTO getSupply(id)

Get a Supply by id

### Example

```ts
import {
  Configuration,
  SuppliesApi,
} from '';
import type { GetSupplyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetSupplyRequest;

  try {
    const data = await api.getSupply(body);
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

[**ApiResponseSupplyTableDTO**](ApiResponseSupplyTableDTO.md)

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


## getSupplyLogs

> ApiResponseListSuppliesLogTableDTO getSupplyLogs(id, pageable)

Get Supply Logs by Supply ID

### Example

```ts
import {
  Configuration,
  SuppliesApi,
} from '';
import type { GetSupplyLogsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // Pageable
    pageable: ...,
  } satisfies GetSupplyLogsRequest;

  try {
    const data = await api.getSupplyLogs(body);
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


## updateSupply

> ApiResponseSupplyTableDTO updateSupply(id, supplyPutDTO)

Update a Supply by id

### Example

```ts
import {
  Configuration,
  SuppliesApi,
} from '';
import type { UpdateSupplyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SuppliesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // SupplyPutDTO
    supplyPutDTO: ...,
  } satisfies UpdateSupplyRequest;

  try {
    const data = await api.updateSupply(body);
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
| **supplyPutDTO** | [SupplyPutDTO](SupplyPutDTO.md) |  | |

### Return type

[**ApiResponseSupplyTableDTO**](ApiResponseSupplyTableDTO.md)

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


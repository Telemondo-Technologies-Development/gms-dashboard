# BillingCycleApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBillingCycle**](BillingCycleApi.md#createbillingcycle) | **POST** /api/billing-cycle | Create a new Billing Cycle |
| [**deleteBillingCycle**](BillingCycleApi.md#deletebillingcycle) | **DELETE** /api/billing-cycle/{id} | Delete a Billing Cycle by id |
| [**getAllBillingCycles**](BillingCycleApi.md#getallbillingcycles) | **GET** /api/billing-cycle | Get all Billing Cycles |
| [**getBillingCycle**](BillingCycleApi.md#getbillingcycle) | **GET** /api/billing-cycle/{id} | Get a Billing Cycle by id |
| [**updateBillingCycle**](BillingCycleApi.md#updatebillingcycle) | **PUT** /api/billing-cycle/{id} | Update a Billing Cycle by id |



## createBillingCycle

> ApiResponseBillingCycleTableDTO createBillingCycle(billingCyclePostDTO)

Create a new Billing Cycle

### Example

```ts
import {
  Configuration,
  BillingCycleApi,
} from '';
import type { CreateBillingCycleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BillingCycleApi();

  const body = {
    // BillingCyclePostDTO
    billingCyclePostDTO: ...,
  } satisfies CreateBillingCycleRequest;

  try {
    const data = await api.createBillingCycle(body);
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
| **billingCyclePostDTO** | [BillingCyclePostDTO](BillingCyclePostDTO.md) |  | |

### Return type

[**ApiResponseBillingCycleTableDTO**](ApiResponseBillingCycleTableDTO.md)

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


## deleteBillingCycle

> ApiResponseUnit deleteBillingCycle(id)

Delete a Billing Cycle by id

### Example

```ts
import {
  Configuration,
  BillingCycleApi,
} from '';
import type { DeleteBillingCycleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BillingCycleApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteBillingCycleRequest;

  try {
    const data = await api.deleteBillingCycle(body);
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


## getAllBillingCycles

> ApiResponseListBillingCycleTableDTO getAllBillingCycles(pageable)

Get all Billing Cycles

### Example

```ts
import {
  Configuration,
  BillingCycleApi,
} from '';
import type { GetAllBillingCyclesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BillingCycleApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllBillingCyclesRequest;

  try {
    const data = await api.getAllBillingCycles(body);
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

[**ApiResponseListBillingCycleTableDTO**](ApiResponseListBillingCycleTableDTO.md)

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


## getBillingCycle

> ApiResponseBillingCycleTableDTO getBillingCycle(id)

Get a Billing Cycle by id

### Example

```ts
import {
  Configuration,
  BillingCycleApi,
} from '';
import type { GetBillingCycleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BillingCycleApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetBillingCycleRequest;

  try {
    const data = await api.getBillingCycle(body);
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

[**ApiResponseBillingCycleTableDTO**](ApiResponseBillingCycleTableDTO.md)

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


## updateBillingCycle

> ApiResponseBillingCycleTableDTO updateBillingCycle(id, billingCyclePutDTO)

Update a Billing Cycle by id

### Example

```ts
import {
  Configuration,
  BillingCycleApi,
} from '';
import type { UpdateBillingCycleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BillingCycleApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // BillingCyclePutDTO
    billingCyclePutDTO: ...,
  } satisfies UpdateBillingCycleRequest;

  try {
    const data = await api.updateBillingCycle(body);
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
| **billingCyclePutDTO** | [BillingCyclePutDTO](BillingCyclePutDTO.md) |  | |

### Return type

[**ApiResponseBillingCycleTableDTO**](ApiResponseBillingCycleTableDTO.md)

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


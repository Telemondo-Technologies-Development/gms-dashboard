# BranchSummaryApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAllBranchSummary**](BranchSummaryApi.md#getallbranchsummary) | **GET** /api/branch-summary | Get all Branch Summary |
| [**getBranchSummary**](BranchSummaryApi.md#getbranchsummary) | **GET** /api/branch-summary/{id} | Get Branch Summary by Branch id |
| [**getBranchSummary1**](BranchSummaryApi.md#getbranchsummary1) | **GET** /api/branch-summary/last-update | Get the time for the last Branch Summary Update |
| [**updateBranchSummary**](BranchSummaryApi.md#updatebranchsummary) | **PUT** /api/branch-summary | Update Branch Summary |



## getAllBranchSummary

> ApiResponseListBranchSummaryTableDTO getAllBranchSummary(pageable, year, month)

Get all Branch Summary

### Example

```ts
import {
  Configuration,
  BranchSummaryApi,
} from '';
import type { GetAllBranchSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchSummaryApi();

  const body = {
    // Pageable
    pageable: ...,
    // number (optional)
    year: 56,
    // number (optional)
    month: 56,
  } satisfies GetAllBranchSummaryRequest;

  try {
    const data = await api.getAllBranchSummary(body);
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
| **year** | `number` |  | [Optional] [Defaults to `undefined`] |
| **month** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiResponseListBranchSummaryTableDTO**](ApiResponseListBranchSummaryTableDTO.md)

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


## getBranchSummary

> ApiResponseListBranchSummaryTableDTO getBranchSummary(pageable, id, year, month)

Get Branch Summary by Branch id

### Example

```ts
import {
  Configuration,
  BranchSummaryApi,
} from '';
import type { GetBranchSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchSummaryApi();

  const body = {
    // Pageable
    pageable: ...,
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // number (optional)
    year: 56,
    // number (optional)
    month: 56,
  } satisfies GetBranchSummaryRequest;

  try {
    const data = await api.getBranchSummary(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |
| **year** | `number` |  | [Optional] [Defaults to `undefined`] |
| **month** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ApiResponseListBranchSummaryTableDTO**](ApiResponseListBranchSummaryTableDTO.md)

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


## getBranchSummary1

> ApiResponseInstant getBranchSummary1()

Get the time for the last Branch Summary Update

### Example

```ts
import {
  Configuration,
  BranchSummaryApi,
} from '';
import type { GetBranchSummary1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchSummaryApi();

  try {
    const data = await api.getBranchSummary1();
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

[**ApiResponseInstant**](ApiResponseInstant.md)

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


## updateBranchSummary

> ApiResponseUnit updateBranchSummary()

Update Branch Summary

### Example

```ts
import {
  Configuration,
  BranchSummaryApi,
} from '';
import type { UpdateBranchSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchSummaryApi();

  try {
    const data = await api.updateBranchSummary();
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


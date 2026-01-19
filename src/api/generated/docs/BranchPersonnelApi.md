# BranchPersonnelApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBranchPersonnel**](BranchPersonnelApi.md#createbranchpersonnel) | **POST** /api/branch/personnel | Create a new Branch Personnel |
| [**deleteBranchPersonnel**](BranchPersonnelApi.md#deletebranchpersonnel) | **DELETE** /api/branch/personnel/{id} | Delete a Branch Personnel by id |
| [**getAllBranchPersonnel**](BranchPersonnelApi.md#getallbranchpersonnel) | **GET** /api/branch/personnel | Get all Branch Personnel |
| [**getBranchPersonnel**](BranchPersonnelApi.md#getbranchpersonnel) | **GET** /api/branch/personnel/{id} | Get a Branch Personnel by id |
| [**updateBranchPersonnel**](BranchPersonnelApi.md#updatebranchpersonnel) | **PUT** /api/branch/personnel/{id} | Update a Branch Personnel by id |



## createBranchPersonnel

> ApiResponseBranchPersonnelTableDTO createBranchPersonnel(branchPersonnelPostDTO)

Create a new Branch Personnel

### Example

```ts
import {
  Configuration,
  BranchPersonnelApi,
} from '';
import type { CreateBranchPersonnelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelApi();

  const body = {
    // BranchPersonnelPostDTO
    branchPersonnelPostDTO: ...,
  } satisfies CreateBranchPersonnelRequest;

  try {
    const data = await api.createBranchPersonnel(body);
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
| **branchPersonnelPostDTO** | [BranchPersonnelPostDTO](BranchPersonnelPostDTO.md) |  | |

### Return type

[**ApiResponseBranchPersonnelTableDTO**](ApiResponseBranchPersonnelTableDTO.md)

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


## deleteBranchPersonnel

> ApiResponseUnit deleteBranchPersonnel(id)

Delete a Branch Personnel by id

### Example

```ts
import {
  Configuration,
  BranchPersonnelApi,
} from '';
import type { DeleteBranchPersonnelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteBranchPersonnelRequest;

  try {
    const data = await api.deleteBranchPersonnel(body);
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


## getAllBranchPersonnel

> ApiResponseListBranchPersonnelTableDTO getAllBranchPersonnel()

Get all Branch Personnel

### Example

```ts
import {
  Configuration,
  BranchPersonnelApi,
} from '';
import type { GetAllBranchPersonnelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelApi();

  try {
    const data = await api.getAllBranchPersonnel();
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

[**ApiResponseListBranchPersonnelTableDTO**](ApiResponseListBranchPersonnelTableDTO.md)

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


## getBranchPersonnel

> ApiResponseBranchPersonnelTableDTO getBranchPersonnel(id)

Get a Branch Personnel by id

### Example

```ts
import {
  Configuration,
  BranchPersonnelApi,
} from '';
import type { GetBranchPersonnelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetBranchPersonnelRequest;

  try {
    const data = await api.getBranchPersonnel(body);
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

[**ApiResponseBranchPersonnelTableDTO**](ApiResponseBranchPersonnelTableDTO.md)

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


## updateBranchPersonnel

> ApiResponseBranchPersonnelTableDTO updateBranchPersonnel(id, branchPersonnelPutDTO)

Update a Branch Personnel by id

### Example

```ts
import {
  Configuration,
  BranchPersonnelApi,
} from '';
import type { UpdateBranchPersonnelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // BranchPersonnelPutDTO
    branchPersonnelPutDTO: ...,
  } satisfies UpdateBranchPersonnelRequest;

  try {
    const data = await api.updateBranchPersonnel(body);
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
| **branchPersonnelPutDTO** | [BranchPersonnelPutDTO](BranchPersonnelPutDTO.md) |  | |

### Return type

[**ApiResponseBranchPersonnelTableDTO**](ApiResponseBranchPersonnelTableDTO.md)

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


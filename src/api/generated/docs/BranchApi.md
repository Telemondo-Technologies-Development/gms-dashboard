# BranchApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBranch**](BranchApi.md#createbranch) | **POST** /api/branch | Create a new Branch |
| [**deleteBranch**](BranchApi.md#deletebranch) | **DELETE** /api/branch/{id} | Delete a Branch by id |
| [**getAllBranches**](BranchApi.md#getallbranches) | **GET** /api/branch | Get all Branches |
| [**getBranch**](BranchApi.md#getbranch) | **GET** /api/branch/{id} | Get a Branch by id |
| [**getBranchEmployees**](BranchApi.md#getbranchemployees) | **GET** /api/branch/{id}/employees | Get all Personnel per Branch by id |
| [**updateBranch**](BranchApi.md#updatebranch) | **PUT** /api/branch/{id} | Update a Branch by id |



## createBranch

> ApiResponseBranchTableDTO createBranch(branchPostDTO)

Create a new Branch

### Example

```ts
import {
  Configuration,
  BranchApi,
} from '';
import type { CreateBranchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchApi();

  const body = {
    // BranchPostDTO
    branchPostDTO: ...,
  } satisfies CreateBranchRequest;

  try {
    const data = await api.createBranch(body);
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
| **branchPostDTO** | [BranchPostDTO](BranchPostDTO.md) |  | |

### Return type

[**ApiResponseBranchTableDTO**](ApiResponseBranchTableDTO.md)

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


## deleteBranch

> ApiResponseUnit deleteBranch(id)

Delete a Branch by id

### Example

```ts
import {
  Configuration,
  BranchApi,
} from '';
import type { DeleteBranchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteBranchRequest;

  try {
    const data = await api.deleteBranch(body);
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


## getAllBranches

> ApiResponseListBranchTableDTO getAllBranches(pageable)

Get all Branches

### Example

```ts
import {
  Configuration,
  BranchApi,
} from '';
import type { GetAllBranchesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllBranchesRequest;

  try {
    const data = await api.getAllBranches(body);
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

[**ApiResponseListBranchTableDTO**](ApiResponseListBranchTableDTO.md)

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


## getBranch

> ApiResponseBranchTableDTO getBranch(id)

Get a Branch by id

### Example

```ts
import {
  Configuration,
  BranchApi,
} from '';
import type { GetBranchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetBranchRequest;

  try {
    const data = await api.getBranch(body);
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

[**ApiResponseBranchTableDTO**](ApiResponseBranchTableDTO.md)

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


## getBranchEmployees

> ApiResponseBranchEmployeesDTO getBranchEmployees(id, status)

Get all Personnel per Branch by id

### Example

```ts
import {
  Configuration,
  BranchApi,
} from '';
import type { GetBranchEmployeesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // 'ACTIVE' | 'MOVED' | 'TERMINATED' | 'RESIGNED' | 'UNDECIDED' (optional)
    status: status_example,
  } satisfies GetBranchEmployeesRequest;

  try {
    const data = await api.getBranchEmployees(body);
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
| **status** | `ACTIVE`, `MOVED`, `TERMINATED`, `RESIGNED`, `UNDECIDED` |  | [Optional] [Defaults to `undefined`] [Enum: ACTIVE, MOVED, TERMINATED, RESIGNED, UNDECIDED] |

### Return type

[**ApiResponseBranchEmployeesDTO**](ApiResponseBranchEmployeesDTO.md)

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


## updateBranch

> ApiResponseBranchTableDTO updateBranch(id, branchPutDTO)

Update a Branch by id

### Example

```ts
import {
  Configuration,
  BranchApi,
} from '';
import type { UpdateBranchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // BranchPutDTO
    branchPutDTO: ...,
  } satisfies UpdateBranchRequest;

  try {
    const data = await api.updateBranch(body);
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
| **branchPutDTO** | [BranchPutDTO](BranchPutDTO.md) |  | |

### Return type

[**ApiResponseBranchTableDTO**](ApiResponseBranchTableDTO.md)

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


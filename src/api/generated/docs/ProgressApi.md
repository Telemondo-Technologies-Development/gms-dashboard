# ProgressApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createProgress**](ProgressApi.md#createprogress) | **POST** /api/member/progress-option/progress | Create a new Personnel Role |
| [**deleteProgress**](ProgressApi.md#deleteprogress) | **DELETE** /api/member/progress-option/progress/{id} | Delete a Personnel Role by id |
| [**getAllProgress**](ProgressApi.md#getallprogress) | **GET** /api/member/progress-option/progress | Get all Personnel Roles |
| [**getProgress**](ProgressApi.md#getprogress) | **GET** /api/member/progress-option/progress/{id} | Get a Personnel Role by id |
| [**updateProgress**](ProgressApi.md#updateprogress) | **PUT** /api/member/progress-option/progress/{id} | Update a Personnel Role by id |



## createProgress

> ApiResponseProgressTableDTO createProgress(progressPostDTO)

Create a new Personnel Role

### Example

```ts
import {
  Configuration,
  ProgressApi,
} from '';
import type { CreateProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressApi();

  const body = {
    // ProgressPostDTO
    progressPostDTO: ...,
  } satisfies CreateProgressRequest;

  try {
    const data = await api.createProgress(body);
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
| **progressPostDTO** | [ProgressPostDTO](ProgressPostDTO.md) |  | |

### Return type

[**ApiResponseProgressTableDTO**](ApiResponseProgressTableDTO.md)

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


## deleteProgress

> ApiResponseUnit deleteProgress(id)

Delete a Personnel Role by id

### Example

```ts
import {
  Configuration,
  ProgressApi,
} from '';
import type { DeleteProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteProgressRequest;

  try {
    const data = await api.deleteProgress(body);
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


## getAllProgress

> ApiResponseListProgressTableDTO getAllProgress(pageable)

Get all Personnel Roles

### Example

```ts
import {
  Configuration,
  ProgressApi,
} from '';
import type { GetAllProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllProgressRequest;

  try {
    const data = await api.getAllProgress(body);
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

[**ApiResponseListProgressTableDTO**](ApiResponseListProgressTableDTO.md)

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


## getProgress

> ApiResponseProgressTableDTO getProgress(id)

Get a Personnel Role by id

### Example

```ts
import {
  Configuration,
  ProgressApi,
} from '';
import type { GetProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetProgressRequest;

  try {
    const data = await api.getProgress(body);
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

[**ApiResponseProgressTableDTO**](ApiResponseProgressTableDTO.md)

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


## updateProgress

> ApiResponseProgressTableDTO updateProgress(id, progressPutDTO)

Update a Personnel Role by id

### Example

```ts
import {
  Configuration,
  ProgressApi,
} from '';
import type { UpdateProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // ProgressPutDTO
    progressPutDTO: ...,
  } satisfies UpdateProgressRequest;

  try {
    const data = await api.updateProgress(body);
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
| **progressPutDTO** | [ProgressPutDTO](ProgressPutDTO.md) |  | |

### Return type

[**ApiResponseProgressTableDTO**](ApiResponseProgressTableDTO.md)

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


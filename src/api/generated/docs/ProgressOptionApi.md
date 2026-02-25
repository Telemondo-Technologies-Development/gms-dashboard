# ProgressOptionApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createProgressOption**](ProgressOptionApi.md#createprogressoption) | **POST** /api/member/progress-option | Create a new Personnel Role |
| [**deleteProgressOption**](ProgressOptionApi.md#deleteprogressoption) | **DELETE** /api/member/progress-option/{id} | Delete a Personnel Role by id |
| [**getAllProgressOptions**](ProgressOptionApi.md#getallprogressoptions) | **GET** /api/member/progress-option | Get all Personnel Roles |
| [**getProgressOption**](ProgressOptionApi.md#getprogressoption) | **GET** /api/member/progress-option/{id} | Get a Personnel Role by id |
| [**updateProgressOption**](ProgressOptionApi.md#updateprogressoption) | **PUT** /api/member/progress-option/{id} | Update a Personnel Role by id |



## createProgressOption

> ApiResponseProgressOptionTableDTO createProgressOption(progressOptionPostDTO)

Create a new Personnel Role

### Example

```ts
import {
  Configuration,
  ProgressOptionApi,
} from '';
import type { CreateProgressOptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressOptionApi();

  const body = {
    // ProgressOptionPostDTO
    progressOptionPostDTO: ...,
  } satisfies CreateProgressOptionRequest;

  try {
    const data = await api.createProgressOption(body);
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
| **progressOptionPostDTO** | [ProgressOptionPostDTO](ProgressOptionPostDTO.md) |  | |

### Return type

[**ApiResponseProgressOptionTableDTO**](ApiResponseProgressOptionTableDTO.md)

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


## deleteProgressOption

> ApiResponseUnit deleteProgressOption(id)

Delete a Personnel Role by id

### Example

```ts
import {
  Configuration,
  ProgressOptionApi,
} from '';
import type { DeleteProgressOptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressOptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteProgressOptionRequest;

  try {
    const data = await api.deleteProgressOption(body);
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


## getAllProgressOptions

> ApiResponseListProgressOptionTableDTO getAllProgressOptions(pageable)

Get all Personnel Roles

### Example

```ts
import {
  Configuration,
  ProgressOptionApi,
} from '';
import type { GetAllProgressOptionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressOptionApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllProgressOptionsRequest;

  try {
    const data = await api.getAllProgressOptions(body);
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

[**ApiResponseListProgressOptionTableDTO**](ApiResponseListProgressOptionTableDTO.md)

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


## getProgressOption

> ApiResponseProgressOptionTableDTO getProgressOption(id)

Get a Personnel Role by id

### Example

```ts
import {
  Configuration,
  ProgressOptionApi,
} from '';
import type { GetProgressOptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressOptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetProgressOptionRequest;

  try {
    const data = await api.getProgressOption(body);
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

[**ApiResponseProgressOptionTableDTO**](ApiResponseProgressOptionTableDTO.md)

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


## updateProgressOption

> ApiResponseProgressOptionTableDTO updateProgressOption(id, progressOptionPutDTO)

Update a Personnel Role by id

### Example

```ts
import {
  Configuration,
  ProgressOptionApi,
} from '';
import type { UpdateProgressOptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProgressOptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // ProgressOptionPutDTO
    progressOptionPutDTO: ...,
  } satisfies UpdateProgressOptionRequest;

  try {
    const data = await api.updateProgressOption(body);
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
| **progressOptionPutDTO** | [ProgressOptionPutDTO](ProgressOptionPutDTO.md) |  | |

### Return type

[**ApiResponseProgressOptionTableDTO**](ApiResponseProgressOptionTableDTO.md)

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


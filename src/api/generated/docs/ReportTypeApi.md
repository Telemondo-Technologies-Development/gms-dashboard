# ReportTypeApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**_delete**](ReportTypeApi.md#_delete) | **DELETE** /api/report/type/{id} | Delete a Report Type by id |
| [**create**](ReportTypeApi.md#create) | **POST** /api/report/type | Create a Report Type |
| [**getAll**](ReportTypeApi.md#getall) | **GET** /api/report/type | Get all Report Types |
| [**getById**](ReportTypeApi.md#getbyid) | **GET** /api/report/type/{id} | Get a Report Type by id |
| [**update**](ReportTypeApi.md#update) | **PUT** /api/report/type/{id} | Update a Report Type |



## _delete

> ApiResponseUnit _delete(id)

Delete a Report Type by id

### Example

```ts
import {
  Configuration,
  ReportTypeApi,
} from '';
import type { DeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportTypeApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteRequest;

  try {
    const data = await api._delete(body);
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


## create

> ApiResponseReportTypeTableDTO create(reportTypePostDTO)

Create a Report Type

### Example

```ts
import {
  Configuration,
  ReportTypeApi,
} from '';
import type { CreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportTypeApi();

  const body = {
    // ReportTypePostDTO
    reportTypePostDTO: ...,
  } satisfies CreateRequest;

  try {
    const data = await api.create(body);
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
| **reportTypePostDTO** | [ReportTypePostDTO](ReportTypePostDTO.md) |  | |

### Return type

[**ApiResponseReportTypeTableDTO**](ApiResponseReportTypeTableDTO.md)

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


## getAll

> ApiResponseListReportTypeTableDTO getAll(pageable)

Get all Report Types

### Example

```ts
import {
  Configuration,
  ReportTypeApi,
} from '';
import type { GetAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportTypeApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllRequest;

  try {
    const data = await api.getAll(body);
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

[**ApiResponseListReportTypeTableDTO**](ApiResponseListReportTypeTableDTO.md)

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


## getById

> ApiResponseReportTypeTableDTO getById(id)

Get a Report Type by id

### Example

```ts
import {
  Configuration,
  ReportTypeApi,
} from '';
import type { GetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportTypeApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetByIdRequest;

  try {
    const data = await api.getById(body);
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

[**ApiResponseReportTypeTableDTO**](ApiResponseReportTypeTableDTO.md)

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


## update

> ApiResponseReportTypeTableDTO update(id, reportTypePutDTO)

Update a Report Type

### Example

```ts
import {
  Configuration,
  ReportTypeApi,
} from '';
import type { UpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportTypeApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // ReportTypePutDTO
    reportTypePutDTO: ...,
  } satisfies UpdateRequest;

  try {
    const data = await api.update(body);
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
| **reportTypePutDTO** | [ReportTypePutDTO](ReportTypePutDTO.md) |  | |

### Return type

[**ApiResponseReportTypeTableDTO**](ApiResponseReportTypeTableDTO.md)

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


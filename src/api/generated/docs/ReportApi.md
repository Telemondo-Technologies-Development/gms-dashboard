# ReportApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createReport**](ReportApi.md#createreport) | **POST** /api/report | Create a Report |
| [**deleteReport**](ReportApi.md#deletereport) | **DELETE** /api/report/{id} | Delete a Report by id |
| [**getAllReports**](ReportApi.md#getallreports) | **GET** /api/report | Get all Reports |
| [**getReport**](ReportApi.md#getreport) | **GET** /api/report/{id} | Get a Report by id |
| [**updateReport**](ReportApi.md#updatereport) | **PUT** /api/report/{id} | Update a Report by id |



## createReport

> ApiResponseReportTableDTO createReport(reportPostDTO)

Create a Report

### Example

```ts
import {
  Configuration,
  ReportApi,
} from '';
import type { CreateReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportApi();

  const body = {
    // ReportPostDTO
    reportPostDTO: ...,
  } satisfies CreateReportRequest;

  try {
    const data = await api.createReport(body);
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
| **reportPostDTO** | [ReportPostDTO](ReportPostDTO.md) |  | |

### Return type

[**ApiResponseReportTableDTO**](ApiResponseReportTableDTO.md)

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


## deleteReport

> ApiResponseUnit deleteReport(id)

Delete a Report by id

### Example

```ts
import {
  Configuration,
  ReportApi,
} from '';
import type { DeleteReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteReportRequest;

  try {
    const data = await api.deleteReport(body);
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


## getAllReports

> ApiResponseListReportTableDTO getAllReports(pageable)

Get all Reports

### Example

```ts
import {
  Configuration,
  ReportApi,
} from '';
import type { GetAllReportsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllReportsRequest;

  try {
    const data = await api.getAllReports(body);
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

[**ApiResponseListReportTableDTO**](ApiResponseListReportTableDTO.md)

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


## getReport

> ApiResponseReportTableDTO getReport(id)

Get a Report by id

### Example

```ts
import {
  Configuration,
  ReportApi,
} from '';
import type { GetReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetReportRequest;

  try {
    const data = await api.getReport(body);
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

[**ApiResponseReportTableDTO**](ApiResponseReportTableDTO.md)

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


## updateReport

> ApiResponseReportTableDTO updateReport(id, reportPutDTO)

Update a Report by id

### Example

```ts
import {
  Configuration,
  ReportApi,
} from '';
import type { UpdateReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ReportApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // ReportPutDTO
    reportPutDTO: ...,
  } satisfies UpdateReportRequest;

  try {
    const data = await api.updateReport(body);
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
| **reportPutDTO** | [ReportPutDTO](ReportPutDTO.md) |  | |

### Return type

[**ApiResponseReportTableDTO**](ApiResponseReportTableDTO.md)

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


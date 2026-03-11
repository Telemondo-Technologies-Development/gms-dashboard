# AttendanceApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createAttendance**](AttendanceApi.md#createattendance) | **POST** /api/member/attendance | Create a new Attendance |
| [**deleteAttendance**](AttendanceApi.md#deleteattendance) | **DELETE** /api/member/attendance/{id} | Delete a Attendance by id |
| [**getAllAttendances**](AttendanceApi.md#getallattendances) | **GET** /api/member/attendance | Get all Attendances |
| [**getAttendance**](AttendanceApi.md#getattendance) | **GET** /api/member/attendance/{id} | Get a Attendance by id |
| [**updateAttendance**](AttendanceApi.md#updateattendance) | **PUT** /api/member/attendance/{id} | Update a Attendance by id |



## createAttendance

> ApiResponseAttendanceTableDTO createAttendance(attendancePostDTO)

Create a new Attendance

### Example

```ts
import {
  Configuration,
  AttendanceApi,
} from '';
import type { CreateAttendanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AttendanceApi();

  const body = {
    // AttendancePostDTO
    attendancePostDTO: ...,
  } satisfies CreateAttendanceRequest;

  try {
    const data = await api.createAttendance(body);
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
| **attendancePostDTO** | [AttendancePostDTO](AttendancePostDTO.md) |  | |

### Return type

[**ApiResponseAttendanceTableDTO**](ApiResponseAttendanceTableDTO.md)

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


## deleteAttendance

> ApiResponseUnit deleteAttendance(id)

Delete a Attendance by id

### Example

```ts
import {
  Configuration,
  AttendanceApi,
} from '';
import type { DeleteAttendanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AttendanceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteAttendanceRequest;

  try {
    const data = await api.deleteAttendance(body);
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


## getAllAttendances

> ApiResponseListAttendanceTableDTO getAllAttendances(pageable)

Get all Attendances

### Example

```ts
import {
  Configuration,
  AttendanceApi,
} from '';
import type { GetAllAttendancesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AttendanceApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllAttendancesRequest;

  try {
    const data = await api.getAllAttendances(body);
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

[**ApiResponseListAttendanceTableDTO**](ApiResponseListAttendanceTableDTO.md)

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


## getAttendance

> ApiResponseAttendanceTableDTO getAttendance(id)

Get a Attendance by id

### Example

```ts
import {
  Configuration,
  AttendanceApi,
} from '';
import type { GetAttendanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AttendanceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetAttendanceRequest;

  try {
    const data = await api.getAttendance(body);
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

[**ApiResponseAttendanceTableDTO**](ApiResponseAttendanceTableDTO.md)

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


## updateAttendance

> ApiResponseAttendanceTableDTO updateAttendance(id, attendancePutDTO)

Update a Attendance by id

### Example

```ts
import {
  Configuration,
  AttendanceApi,
} from '';
import type { UpdateAttendanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AttendanceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // AttendancePutDTO
    attendancePutDTO: ...,
  } satisfies UpdateAttendanceRequest;

  try {
    const data = await api.updateAttendance(body);
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
| **attendancePutDTO** | [AttendancePutDTO](AttendancePutDTO.md) |  | |

### Return type

[**ApiResponseAttendanceTableDTO**](ApiResponseAttendanceTableDTO.md)

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


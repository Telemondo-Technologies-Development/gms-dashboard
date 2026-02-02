# MaintenanceScheduleApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSchedule**](MaintenanceScheduleApi.md#createschedule) | **POST** /api/asset/maintenance/schedule |  |
| [**deleteSchedule**](MaintenanceScheduleApi.md#deleteschedule) | **DELETE** /api/asset/maintenance/schedule/{id} |  |
| [**getAllSchedules**](MaintenanceScheduleApi.md#getallschedules) | **GET** /api/asset/maintenance/schedule |  |
| [**getAsset1**](MaintenanceScheduleApi.md#getasset1) | **GET** /api/asset/maintenance/schedule/{id} | Get an asset by ID |
| [**updateSchedule**](MaintenanceScheduleApi.md#updateschedule) | **PUT** /api/asset/maintenance/schedule/{id} |  |



## createSchedule

> ApiResponseScheduleTableDTO createSchedule(schedulePostDTO)



### Example

```ts
import {
  Configuration,
  MaintenanceScheduleApi,
} from '';
import type { CreateScheduleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaintenanceScheduleApi();

  const body = {
    // SchedulePostDTO
    schedulePostDTO: ...,
  } satisfies CreateScheduleRequest;

  try {
    const data = await api.createSchedule(body);
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
| **schedulePostDTO** | [SchedulePostDTO](SchedulePostDTO.md) |  | |

### Return type

[**ApiResponseScheduleTableDTO**](ApiResponseScheduleTableDTO.md)

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


## deleteSchedule

> ApiResponseUnit deleteSchedule(id)



### Example

```ts
import {
  Configuration,
  MaintenanceScheduleApi,
} from '';
import type { DeleteScheduleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaintenanceScheduleApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteScheduleRequest;

  try {
    const data = await api.deleteSchedule(body);
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


## getAllSchedules

> ApiResponseListScheduleTableDTO getAllSchedules(pageable)



### Example

```ts
import {
  Configuration,
  MaintenanceScheduleApi,
} from '';
import type { GetAllSchedulesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaintenanceScheduleApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSchedulesRequest;

  try {
    const data = await api.getAllSchedules(body);
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

[**ApiResponseListScheduleTableDTO**](ApiResponseListScheduleTableDTO.md)

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


## getAsset1

> ApiResponseScheduleTableDTO getAsset1(id)

Get an asset by ID

### Example

```ts
import {
  Configuration,
  MaintenanceScheduleApi,
} from '';
import type { GetAsset1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaintenanceScheduleApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetAsset1Request;

  try {
    const data = await api.getAsset1(body);
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

[**ApiResponseScheduleTableDTO**](ApiResponseScheduleTableDTO.md)

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


## updateSchedule

> ApiResponseScheduleTableDTO updateSchedule(id, schedulePutDTO)



### Example

```ts
import {
  Configuration,
  MaintenanceScheduleApi,
} from '';
import type { UpdateScheduleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MaintenanceScheduleApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // SchedulePutDTO
    schedulePutDTO: ...,
  } satisfies UpdateScheduleRequest;

  try {
    const data = await api.updateSchedule(body);
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
| **schedulePutDTO** | [SchedulePutDTO](SchedulePutDTO.md) |  | |

### Return type

[**ApiResponseScheduleTableDTO**](ApiResponseScheduleTableDTO.md)

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


# EmployeeApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createEmployee**](EmployeeApi.md#createemployee) | **POST** /api/employee | Create a new Employee |
| [**deleteEmployee**](EmployeeApi.md#deleteemployee) | **DELETE** /api/employee/{id} | Delete an Employee by id |
| [**getAllEmployees**](EmployeeApi.md#getallemployees) | **GET** /api/employee | Get all Employees |
| [**getEmployee**](EmployeeApi.md#getemployee) | **GET** /api/employee/{id} | Get an Employee by id |
| [**updateEmployee**](EmployeeApi.md#updateemployee) | **PUT** /api/employee/{id} | Update an Employee by id |
| [**uploadEmployeeProfile**](EmployeeApi.md#uploademployeeprofile) | **POST** /api/employee/picture | Upload an employee profile picture into the object storage (public) |



## createEmployee

> ApiResponseEmployeeTableDTO createEmployee(employeePostDTO)

Create a new Employee

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { CreateEmployeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // EmployeePostDTO
    employeePostDTO: ...,
  } satisfies CreateEmployeeRequest;

  try {
    const data = await api.createEmployee(body);
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
| **employeePostDTO** | [EmployeePostDTO](EmployeePostDTO.md) |  | |

### Return type

[**ApiResponseEmployeeTableDTO**](ApiResponseEmployeeTableDTO.md)

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


## deleteEmployee

> ApiResponseUnit deleteEmployee(id)

Delete an Employee by id

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { DeleteEmployeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteEmployeeRequest;

  try {
    const data = await api.deleteEmployee(body);
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


## getAllEmployees

> ApiResponseListEmployeeTableDTO getAllEmployees(pageable)

Get all Employees

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { GetAllEmployeesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllEmployeesRequest;

  try {
    const data = await api.getAllEmployees(body);
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

[**ApiResponseListEmployeeTableDTO**](ApiResponseListEmployeeTableDTO.md)

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


## getEmployee

> ApiResponseEmployeeTableDTO getEmployee(id)

Get an Employee by id

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { GetEmployeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetEmployeeRequest;

  try {
    const data = await api.getEmployee(body);
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

[**ApiResponseEmployeeTableDTO**](ApiResponseEmployeeTableDTO.md)

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


## updateEmployee

> ApiResponseEmployeeTableDTO updateEmployee(id, employeePutDTO)

Update an Employee by id

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { UpdateEmployeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // EmployeePutDTO
    employeePutDTO: ...,
  } satisfies UpdateEmployeeRequest;

  try {
    const data = await api.updateEmployee(body);
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
| **employeePutDTO** | [EmployeePutDTO](EmployeePutDTO.md) |  | |

### Return type

[**ApiResponseEmployeeTableDTO**](ApiResponseEmployeeTableDTO.md)

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


## uploadEmployeeProfile

> ApiResponseObjectStorage uploadEmployeeProfile(uploadBranchLogoRequest)

Upload an employee profile picture into the object storage (public)

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { UploadEmployeeProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadEmployeeProfileRequest;

  try {
    const data = await api.uploadEmployeeProfile(body);
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
| **uploadBranchLogoRequest** | [UploadBranchLogoRequest](UploadBranchLogoRequest.md) |  | [Optional] |

### Return type

[**ApiResponseObjectStorage**](ApiResponseObjectStorage.md)

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


# BranchPersonnelRolesApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPersonnelRole**](BranchPersonnelRolesApi.md#createpersonnelrole) | **POST** /api/branch/personnel/role | Create a new Personnel Role |
| [**deletePersonnelRole**](BranchPersonnelRolesApi.md#deletepersonnelrole) | **DELETE** /api/branch/personnel/role/{id} | Delete a Personnel Role by id |
| [**getAllPersonnelRoles**](BranchPersonnelRolesApi.md#getallpersonnelroles) | **GET** /api/branch/personnel/role | Get all Personnel Roles |
| [**getPersonnelRole**](BranchPersonnelRolesApi.md#getpersonnelrole) | **GET** /api/branch/personnel/role/{id} | Get a Personnel Role by id |
| [**updatePersonnelRole**](BranchPersonnelRolesApi.md#updatepersonnelrole) | **PUT** /api/branch/personnel/role/{id} | Update a Personnel Role by id |



## createPersonnelRole

> ApiResponsePersonnelRoleTableDTO createPersonnelRole(personnelRolePostDTO)

Create a new Personnel Role

### Example

```ts
import {
  Configuration,
  BranchPersonnelRolesApi,
} from '';
import type { CreatePersonnelRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelRolesApi();

  const body = {
    // PersonnelRolePostDTO
    personnelRolePostDTO: ...,
  } satisfies CreatePersonnelRoleRequest;

  try {
    const data = await api.createPersonnelRole(body);
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
| **personnelRolePostDTO** | [PersonnelRolePostDTO](PersonnelRolePostDTO.md) |  | |

### Return type

[**ApiResponsePersonnelRoleTableDTO**](ApiResponsePersonnelRoleTableDTO.md)

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


## deletePersonnelRole

> ApiResponseUnit deletePersonnelRole(id)

Delete a Personnel Role by id

### Example

```ts
import {
  Configuration,
  BranchPersonnelRolesApi,
} from '';
import type { DeletePersonnelRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelRolesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeletePersonnelRoleRequest;

  try {
    const data = await api.deletePersonnelRole(body);
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


## getAllPersonnelRoles

> ApiResponseListPersonnelRoleTableDTO getAllPersonnelRoles(pageable)

Get all Personnel Roles

### Example

```ts
import {
  Configuration,
  BranchPersonnelRolesApi,
} from '';
import type { GetAllPersonnelRolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelRolesApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllPersonnelRolesRequest;

  try {
    const data = await api.getAllPersonnelRoles(body);
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

[**ApiResponseListPersonnelRoleTableDTO**](ApiResponseListPersonnelRoleTableDTO.md)

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


## getPersonnelRole

> ApiResponsePersonnelRoleTableDTO getPersonnelRole(id)

Get a Personnel Role by id

### Example

```ts
import {
  Configuration,
  BranchPersonnelRolesApi,
} from '';
import type { GetPersonnelRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelRolesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetPersonnelRoleRequest;

  try {
    const data = await api.getPersonnelRole(body);
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

[**ApiResponsePersonnelRoleTableDTO**](ApiResponsePersonnelRoleTableDTO.md)

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


## updatePersonnelRole

> ApiResponsePersonnelRoleTableDTO updatePersonnelRole(id, personnelRolePutDTO)

Update a Personnel Role by id

### Example

```ts
import {
  Configuration,
  BranchPersonnelRolesApi,
} from '';
import type { UpdatePersonnelRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BranchPersonnelRolesApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // PersonnelRolePutDTO
    personnelRolePutDTO: ...,
  } satisfies UpdatePersonnelRoleRequest;

  try {
    const data = await api.updatePersonnelRole(body);
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
| **personnelRolePutDTO** | [PersonnelRolePutDTO](PersonnelRolePutDTO.md) |  | |

### Return type

[**ApiResponsePersonnelRoleTableDTO**](ApiResponsePersonnelRoleTableDTO.md)

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


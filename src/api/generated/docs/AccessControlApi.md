# AccessControlApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addRolePermissions**](AccessControlApi.md#addrolepermissions) | **POST** /api/role/{id}/permission | Update a Role\&#39;s Permission by id |
| [**createPermission**](AccessControlApi.md#createpermission) | **POST** /api/permission | [DEV] Create a new Permission |
| [**createRole**](AccessControlApi.md#createrole) | **POST** /api/role | Create a new Role |
| [**deleteRole**](AccessControlApi.md#deleterole) | **DELETE** /api/role/{id} | Delete a Role by id |
| [**deleteRolePermissions**](AccessControlApi.md#deleterolepermissions) | **DELETE** /api/role/{id}/permission | Delete a Role\&#39;s Permission by id |
| [**getAllPermissions**](AccessControlApi.md#getallpermissions) | **GET** /api/permission | Get all Permissions |
| [**getAllRoles**](AccessControlApi.md#getallroles) | **GET** /api/role | Get all Roles |
| [**getPermission**](AccessControlApi.md#getpermission) | **GET** /api/permission/{id} | Get a Permission by id |
| [**getRole**](AccessControlApi.md#getrole) | **GET** /api/role/{id} | Get a Role with its Permissions by id |
| [**updateRole**](AccessControlApi.md#updaterole) | **PUT** /api/role/{id} | Update a Role by id |
| [**updateRolePermissions**](AccessControlApi.md#updaterolepermissions) | **PUT** /api/role/{id}/permission | Update a Role\&#39;s Permission by id |



## addRolePermissions

> ApiResponseRolePermissionTableDTO addRolePermissions(id, rolePermissionDTO)

Update a Role\&#39;s Permission by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { AddRolePermissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // RolePermissionDTO
    rolePermissionDTO: ...,
  } satisfies AddRolePermissionsRequest;

  try {
    const data = await api.addRolePermissions(body);
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
| **rolePermissionDTO** | [RolePermissionDTO](RolePermissionDTO.md) |  | |

### Return type

[**ApiResponseRolePermissionTableDTO**](ApiResponseRolePermissionTableDTO.md)

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


## createPermission

> ApiResponseUnit createPermission(requestBody)

[DEV] Create a new Permission

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { CreatePermissionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // Set<string>
    requestBody: ...,
  } satisfies CreatePermissionRequest;

  try {
    const data = await api.createPermission(body);
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
| **requestBody** | `Set<string>` |  | |

### Return type

[**ApiResponseUnit**](ApiResponseUnit.md)

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


## createRole

> ApiResponseRoleTableDTO createRole(rolePostDTO)

Create a new Role

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { CreateRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // RolePostDTO
    rolePostDTO: ...,
  } satisfies CreateRoleRequest;

  try {
    const data = await api.createRole(body);
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
| **rolePostDTO** | [RolePostDTO](RolePostDTO.md) |  | |

### Return type

[**ApiResponseRoleTableDTO**](ApiResponseRoleTableDTO.md)

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


## deleteRole

> ApiResponseUnit deleteRole(id)

Delete a Role by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { DeleteRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteRoleRequest;

  try {
    const data = await api.deleteRole(body);
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


## deleteRolePermissions

> ApiResponseUnit deleteRolePermissions(id, rolePermissionDTO)

Delete a Role\&#39;s Permission by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { DeleteRolePermissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // RolePermissionDTO
    rolePermissionDTO: ...,
  } satisfies DeleteRolePermissionsRequest;

  try {
    const data = await api.deleteRolePermissions(body);
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
| **rolePermissionDTO** | [RolePermissionDTO](RolePermissionDTO.md) |  | |

### Return type

[**ApiResponseUnit**](ApiResponseUnit.md)

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


## getAllPermissions

> ApiResponseListPermission getAllPermissions(pageable)

Get all Permissions

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { GetAllPermissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllPermissionsRequest;

  try {
    const data = await api.getAllPermissions(body);
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

[**ApiResponseListPermission**](ApiResponseListPermission.md)

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


## getAllRoles

> ApiResponseListRoleTableDTO getAllRoles(pageable)

Get all Roles

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { GetAllRolesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllRolesRequest;

  try {
    const data = await api.getAllRoles(body);
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

[**ApiResponseListRoleTableDTO**](ApiResponseListRoleTableDTO.md)

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


## getPermission

> ApiResponsePermission getPermission(id)

Get a Permission by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { GetPermissionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetPermissionRequest;

  try {
    const data = await api.getPermission(body);
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

[**ApiResponsePermission**](ApiResponsePermission.md)

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


## getRole

> ApiResponseRolePermissionTableDTO getRole(id)

Get a Role with its Permissions by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { GetRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetRoleRequest;

  try {
    const data = await api.getRole(body);
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

[**ApiResponseRolePermissionTableDTO**](ApiResponseRolePermissionTableDTO.md)

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


## updateRole

> ApiResponseRoleTableDTO updateRole(id, rolePutDTO)

Update a Role by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { UpdateRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // RolePutDTO
    rolePutDTO: ...,
  } satisfies UpdateRoleRequest;

  try {
    const data = await api.updateRole(body);
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
| **rolePutDTO** | [RolePutDTO](RolePutDTO.md) |  | |

### Return type

[**ApiResponseRoleTableDTO**](ApiResponseRoleTableDTO.md)

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


## updateRolePermissions

> ApiResponseRolePermissionTableDTO updateRolePermissions(id, rolePermissionDTO)

Update a Role\&#39;s Permission by id

### Example

```ts
import {
  Configuration,
  AccessControlApi,
} from '';
import type { UpdateRolePermissionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AccessControlApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // RolePermissionDTO
    rolePermissionDTO: ...,
  } satisfies UpdateRolePermissionsRequest;

  try {
    const data = await api.updateRolePermissions(body);
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
| **rolePermissionDTO** | [RolePermissionDTO](RolePermissionDTO.md) |  | |

### Return type

[**ApiResponseRolePermissionTableDTO**](ApiResponseRolePermissionTableDTO.md)

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


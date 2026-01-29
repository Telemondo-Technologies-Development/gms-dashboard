# UserApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createUser**](UserApi.md#createuser) | **POST** /api/user | Create a new User |
| [**deleteUser**](UserApi.md#deleteuser) | **DELETE** /api/user/{id} | Delete a User by id |
| [**getAllUsers**](UserApi.md#getallusers) | **GET** /api/user | Get all Users |
| [**getUser**](UserApi.md#getuser) | **GET** /api/user/{id} | Get a User by id |
| [**updateUser**](UserApi.md#updateuser) | **PUT** /api/user/{id} | Update a User by id |



## createUser

> ApiResponseUserTableDTO createUser(userPostDTO)

Create a new User

Creates a new user record in the database

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { CreateUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // UserPostDTO
    userPostDTO: ...,
  } satisfies CreateUserRequest;

  try {
    const data = await api.createUser(body);
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
| **userPostDTO** | [UserPostDTO](UserPostDTO.md) |  | |

### Return type

[**ApiResponseUserTableDTO**](ApiResponseUserTableDTO.md)

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


## deleteUser

> ApiResponseUnit deleteUser(id)

Delete a User by id

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { DeleteUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteUserRequest;

  try {
    const data = await api.deleteUser(body);
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


## getAllUsers

> ApiResponseListUserTableDTO getAllUsers(pageable)

Get all Users

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { GetAllUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllUsersRequest;

  try {
    const data = await api.getAllUsers(body);
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

[**ApiResponseListUserTableDTO**](ApiResponseListUserTableDTO.md)

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


## getUser

> ApiResponseUserTableDTO getUser(id)

Get a User by id

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { GetUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetUserRequest;

  try {
    const data = await api.getUser(body);
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

[**ApiResponseUserTableDTO**](ApiResponseUserTableDTO.md)

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


## updateUser

> ApiResponseUserTableDTO updateUser(id, userPutDTO)

Update a User by id

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { UpdateUserRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // UserPutDTO
    userPutDTO: ...,
  } satisfies UpdateUserRequest;

  try {
    const data = await api.updateUser(body);
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
| **userPutDTO** | [UserPutDTO](UserPutDTO.md) |  | |

### Return type

[**ApiResponseUserTableDTO**](ApiResponseUserTableDTO.md)

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


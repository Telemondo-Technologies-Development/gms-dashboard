# MemberProgressApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMemberProgress**](MemberProgressApi.md#creatememberprogress) | **POST** /api/member/progress | Create a new Member Progress |
| [**deleteMemberProgress**](MemberProgressApi.md#deletememberprogress) | **DELETE** /api/member/progress/{id} | Delete a Member Progress by id |
| [**getAllMemberProgress**](MemberProgressApi.md#getallmemberprogress) | **GET** /api/member/progress | Get all Member Progress |
| [**getMemberProgress**](MemberProgressApi.md#getmemberprogress) | **GET** /api/member/progress/{id} | Get a Member Progress by id |
| [**updateMemberProgress**](MemberProgressApi.md#updatememberprogress) | **PUT** /api/member/progress/{id} | Update a Member Progress by id |



## createMemberProgress

> ApiResponseMemberProgressTableDTO createMemberProgress(memberProgressPostDTO)

Create a new Member Progress

### Example

```ts
import {
  Configuration,
  MemberProgressApi,
} from '';
import type { CreateMemberProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberProgressApi();

  const body = {
    // MemberProgressPostDTO
    memberProgressPostDTO: ...,
  } satisfies CreateMemberProgressRequest;

  try {
    const data = await api.createMemberProgress(body);
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
| **memberProgressPostDTO** | [MemberProgressPostDTO](MemberProgressPostDTO.md) |  | |

### Return type

[**ApiResponseMemberProgressTableDTO**](ApiResponseMemberProgressTableDTO.md)

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


## deleteMemberProgress

> ApiResponseUnit deleteMemberProgress(id)

Delete a Member Progress by id

### Example

```ts
import {
  Configuration,
  MemberProgressApi,
} from '';
import type { DeleteMemberProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberProgressApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteMemberProgressRequest;

  try {
    const data = await api.deleteMemberProgress(body);
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


## getAllMemberProgress

> ApiResponseListMemberProgressTableDTO getAllMemberProgress(pageable)

Get all Member Progress

### Example

```ts
import {
  Configuration,
  MemberProgressApi,
} from '';
import type { GetAllMemberProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberProgressApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllMemberProgressRequest;

  try {
    const data = await api.getAllMemberProgress(body);
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

[**ApiResponseListMemberProgressTableDTO**](ApiResponseListMemberProgressTableDTO.md)

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


## getMemberProgress

> ApiResponseMemberProgressTableDTO getMemberProgress(id)

Get a Member Progress by id

### Example

```ts
import {
  Configuration,
  MemberProgressApi,
} from '';
import type { GetMemberProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberProgressApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetMemberProgressRequest;

  try {
    const data = await api.getMemberProgress(body);
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

[**ApiResponseMemberProgressTableDTO**](ApiResponseMemberProgressTableDTO.md)

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


## updateMemberProgress

> ApiResponseMemberProgressTableDTO updateMemberProgress(id, memberProgressPutDTO)

Update a Member Progress by id

### Example

```ts
import {
  Configuration,
  MemberProgressApi,
} from '';
import type { UpdateMemberProgressRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberProgressApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // MemberProgressPutDTO
    memberProgressPutDTO: ...,
  } satisfies UpdateMemberProgressRequest;

  try {
    const data = await api.updateMemberProgress(body);
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
| **memberProgressPutDTO** | [MemberProgressPutDTO](MemberProgressPutDTO.md) |  | |

### Return type

[**ApiResponseMemberProgressTableDTO**](ApiResponseMemberProgressTableDTO.md)

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


# MemberSubscriptionApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMemberSubscription**](MemberSubscriptionApi.md#createmembersubscription) | **POST** /api/member/subscription | Create a new MemberSubscription |
| [**deleteMemberSubscription**](MemberSubscriptionApi.md#deletemembersubscription) | **DELETE** /api/member/subscription/{id} | Delete a MemberSubscription by id |
| [**getAllMemberSubscriptions**](MemberSubscriptionApi.md#getallmembersubscriptions) | **GET** /api/member/subscription | Get all MemberSubscriptions |
| [**getMemberSubscription**](MemberSubscriptionApi.md#getmembersubscription) | **GET** /api/member/subscription/{id} | Get a MemberSubscription by id |
| [**updateMemberSubscription**](MemberSubscriptionApi.md#updatemembersubscription) | **PUT** /api/member/subscription/{id} | Update a MemberSubscription by id |



## createMemberSubscription

> ApiResponseMemberSubscriptionTableDTO createMemberSubscription(memberSubscriptionPostDTO)

Create a new MemberSubscription

### Example

```ts
import {
  Configuration,
  MemberSubscriptionApi,
} from '';
import type { CreateMemberSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberSubscriptionApi();

  const body = {
    // MemberSubscriptionPostDTO
    memberSubscriptionPostDTO: ...,
  } satisfies CreateMemberSubscriptionRequest;

  try {
    const data = await api.createMemberSubscription(body);
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
| **memberSubscriptionPostDTO** | [MemberSubscriptionPostDTO](MemberSubscriptionPostDTO.md) |  | |

### Return type

[**ApiResponseMemberSubscriptionTableDTO**](ApiResponseMemberSubscriptionTableDTO.md)

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


## deleteMemberSubscription

> ApiResponseUnit deleteMemberSubscription(id)

Delete a MemberSubscription by id

### Example

```ts
import {
  Configuration,
  MemberSubscriptionApi,
} from '';
import type { DeleteMemberSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberSubscriptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteMemberSubscriptionRequest;

  try {
    const data = await api.deleteMemberSubscription(body);
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


## getAllMemberSubscriptions

> ApiResponseListMemberSubscriptionTableDTO getAllMemberSubscriptions(pageable)

Get all MemberSubscriptions

### Example

```ts
import {
  Configuration,
  MemberSubscriptionApi,
} from '';
import type { GetAllMemberSubscriptionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberSubscriptionApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllMemberSubscriptionsRequest;

  try {
    const data = await api.getAllMemberSubscriptions(body);
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

[**ApiResponseListMemberSubscriptionTableDTO**](ApiResponseListMemberSubscriptionTableDTO.md)

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


## getMemberSubscription

> ApiResponseMemberSubscriptionTableDTO getMemberSubscription(id)

Get a MemberSubscription by id

### Example

```ts
import {
  Configuration,
  MemberSubscriptionApi,
} from '';
import type { GetMemberSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberSubscriptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetMemberSubscriptionRequest;

  try {
    const data = await api.getMemberSubscription(body);
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

[**ApiResponseMemberSubscriptionTableDTO**](ApiResponseMemberSubscriptionTableDTO.md)

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


## updateMemberSubscription

> ApiResponseMemberSubscriptionTableDTO updateMemberSubscription(id, memberSubscriptionPutDTO)

Update a MemberSubscription by id

### Example

```ts
import {
  Configuration,
  MemberSubscriptionApi,
} from '';
import type { UpdateMemberSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberSubscriptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // MemberSubscriptionPutDTO
    memberSubscriptionPutDTO: ...,
  } satisfies UpdateMemberSubscriptionRequest;

  try {
    const data = await api.updateMemberSubscription(body);
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
| **memberSubscriptionPutDTO** | [MemberSubscriptionPutDTO](MemberSubscriptionPutDTO.md) |  | |

### Return type

[**ApiResponseMemberSubscriptionTableDTO**](ApiResponseMemberSubscriptionTableDTO.md)

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


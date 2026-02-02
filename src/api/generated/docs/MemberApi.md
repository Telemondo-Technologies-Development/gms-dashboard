# MemberApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMember**](MemberApi.md#createmember) | **POST** /api/member | Create a new Member |
| [**deleteMember**](MemberApi.md#deletemember) | **DELETE** /api/member/{id} | Delete a Member by id |
| [**getAllMembers**](MemberApi.md#getallmembers) | **GET** /api/member | Get all Members |
| [**getMember**](MemberApi.md#getmember) | **GET** /api/member/{id} | Get a Member by id |
| [**updateMember**](MemberApi.md#updatemember) | **PUT** /api/member/{id} | Update a Member by id |
| [**uploadMemberProfile**](MemberApi.md#uploadmemberprofile) | **POST** /api/member/picture | Upload a member profile picture into the object storage (public) |



## createMember

> ApiResponseMemberTableDTO createMember(memberPostDTO)

Create a new Member

### Example

```ts
import {
  Configuration,
  MemberApi,
} from '';
import type { CreateMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberApi();

  const body = {
    // MemberPostDTO
    memberPostDTO: ...,
  } satisfies CreateMemberRequest;

  try {
    const data = await api.createMember(body);
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
| **memberPostDTO** | [MemberPostDTO](MemberPostDTO.md) |  | |

### Return type

[**ApiResponseMemberTableDTO**](ApiResponseMemberTableDTO.md)

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


## deleteMember

> ApiResponseUnit deleteMember(id)

Delete a Member by id

### Example

```ts
import {
  Configuration,
  MemberApi,
} from '';
import type { DeleteMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteMemberRequest;

  try {
    const data = await api.deleteMember(body);
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


## getAllMembers

> ApiResponseListMemberTableDTO getAllMembers(pageable)

Get all Members

### Example

```ts
import {
  Configuration,
  MemberApi,
} from '';
import type { GetAllMembersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllMembersRequest;

  try {
    const data = await api.getAllMembers(body);
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

[**ApiResponseListMemberTableDTO**](ApiResponseListMemberTableDTO.md)

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


## getMember

> ApiResponseMemberTableDTO getMember(id)

Get a Member by id

### Example

```ts
import {
  Configuration,
  MemberApi,
} from '';
import type { GetMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetMemberRequest;

  try {
    const data = await api.getMember(body);
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

[**ApiResponseMemberTableDTO**](ApiResponseMemberTableDTO.md)

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


## updateMember

> ApiResponseMemberTableDTO updateMember(id, memberPutDTO)

Update a Member by id

### Example

```ts
import {
  Configuration,
  MemberApi,
} from '';
import type { UpdateMemberRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // MemberPutDTO
    memberPutDTO: ...,
  } satisfies UpdateMemberRequest;

  try {
    const data = await api.updateMember(body);
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
| **memberPutDTO** | [MemberPutDTO](MemberPutDTO.md) |  | |

### Return type

[**ApiResponseMemberTableDTO**](ApiResponseMemberTableDTO.md)

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


## uploadMemberProfile

> ApiResponseObjectStorage uploadMemberProfile(uploadBranchLogoRequest)

Upload a member profile picture into the object storage (public)

### Example

```ts
import {
  Configuration,
  MemberApi,
} from '';
import type { UploadMemberProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new MemberApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadMemberProfileRequest;

  try {
    const data = await api.uploadMemberProfile(body);
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


# SubscriptionAvailedApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSubscriptionAvailed**](SubscriptionAvailedApi.md#createsubscriptionavailed) | **POST** /api/subscription-availed | Create a new Subscription Availed |
| [**deleteSubscriptionAvailed**](SubscriptionAvailedApi.md#deletesubscriptionavailed) | **DELETE** /api/subscription-availed/{id} | Delete a Subscription Availed by id |
| [**getAllSubscriptionAvailed**](SubscriptionAvailedApi.md#getallsubscriptionavailed) | **GET** /api/subscription-availed | Get all Subscription Availed |
| [**getSubscriptionAvailed**](SubscriptionAvailedApi.md#getsubscriptionavailed) | **GET** /api/subscription-availed/{id} | Get a Subscription Availed by id |



## createSubscriptionAvailed

> ApiResponseSubscriptionAvailedTableDTO createSubscriptionAvailed(subscriptionAvailedPostDTO)

Create a new Subscription Availed

### Example

```ts
import {
  Configuration,
  SubscriptionAvailedApi,
} from '';
import type { CreateSubscriptionAvailedRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionAvailedApi();

  const body = {
    // SubscriptionAvailedPostDTO
    subscriptionAvailedPostDTO: ...,
  } satisfies CreateSubscriptionAvailedRequest;

  try {
    const data = await api.createSubscriptionAvailed(body);
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
| **subscriptionAvailedPostDTO** | [SubscriptionAvailedPostDTO](SubscriptionAvailedPostDTO.md) |  | |

### Return type

[**ApiResponseSubscriptionAvailedTableDTO**](ApiResponseSubscriptionAvailedTableDTO.md)

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


## deleteSubscriptionAvailed

> ApiResponseUnit deleteSubscriptionAvailed(id)

Delete a Subscription Availed by id

### Example

```ts
import {
  Configuration,
  SubscriptionAvailedApi,
} from '';
import type { DeleteSubscriptionAvailedRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionAvailedApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteSubscriptionAvailedRequest;

  try {
    const data = await api.deleteSubscriptionAvailed(body);
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


## getAllSubscriptionAvailed

> ApiResponseListSubscriptionAvailedTableDTO getAllSubscriptionAvailed(pageable)

Get all Subscription Availed

### Example

```ts
import {
  Configuration,
  SubscriptionAvailedApi,
} from '';
import type { GetAllSubscriptionAvailedRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionAvailedApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSubscriptionAvailedRequest;

  try {
    const data = await api.getAllSubscriptionAvailed(body);
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

[**ApiResponseListSubscriptionAvailedTableDTO**](ApiResponseListSubscriptionAvailedTableDTO.md)

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


## getSubscriptionAvailed

> ApiResponseSubscriptionAvailedTableDTO getSubscriptionAvailed(id)

Get a Subscription Availed by id

### Example

```ts
import {
  Configuration,
  SubscriptionAvailedApi,
} from '';
import type { GetSubscriptionAvailedRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionAvailedApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetSubscriptionAvailedRequest;

  try {
    const data = await api.getSubscriptionAvailed(body);
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

[**ApiResponseSubscriptionAvailedTableDTO**](ApiResponseSubscriptionAvailedTableDTO.md)

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


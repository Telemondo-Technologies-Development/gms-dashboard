# SubscriptionApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSubscription**](SubscriptionApi.md#createsubscription) | **POST** /api/subscription | Create a new Subscription |
| [**deleteSubscription**](SubscriptionApi.md#deletesubscription) | **DELETE** /api/subscription/{id} | Delete a Subscription by id |
| [**getAllSubscriptions**](SubscriptionApi.md#getallsubscriptions) | **GET** /api/subscription | Get all Subscriptions |
| [**getSubscription**](SubscriptionApi.md#getsubscription) | **GET** /api/subscription/{id} | Get a Subscription by id |
| [**updateSubscription**](SubscriptionApi.md#updatesubscription) | **PUT** /api/subscription/{id} | Update a Subscription by id |



## createSubscription

> ApiResponseSubscriptionTableDTO createSubscription(subscriptionPostDTO)

Create a new Subscription

### Example

```ts
import {
  Configuration,
  SubscriptionApi,
} from '';
import type { CreateSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionApi();

  const body = {
    // SubscriptionPostDTO
    subscriptionPostDTO: ...,
  } satisfies CreateSubscriptionRequest;

  try {
    const data = await api.createSubscription(body);
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
| **subscriptionPostDTO** | [SubscriptionPostDTO](SubscriptionPostDTO.md) |  | |

### Return type

[**ApiResponseSubscriptionTableDTO**](ApiResponseSubscriptionTableDTO.md)

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


## deleteSubscription

> ApiResponseUnit deleteSubscription(id)

Delete a Subscription by id

### Example

```ts
import {
  Configuration,
  SubscriptionApi,
} from '';
import type { DeleteSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteSubscriptionRequest;

  try {
    const data = await api.deleteSubscription(body);
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


## getAllSubscriptions

> ApiResponseListSubscriptionTableDTO getAllSubscriptions(pageable)

Get all Subscriptions

### Example

```ts
import {
  Configuration,
  SubscriptionApi,
} from '';
import type { GetAllSubscriptionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllSubscriptionsRequest;

  try {
    const data = await api.getAllSubscriptions(body);
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

[**ApiResponseListSubscriptionTableDTO**](ApiResponseListSubscriptionTableDTO.md)

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


## getSubscription

> ApiResponseSubscriptionTableDTO getSubscription(id)

Get a Subscription by id

### Example

```ts
import {
  Configuration,
  SubscriptionApi,
} from '';
import type { GetSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetSubscriptionRequest;

  try {
    const data = await api.getSubscription(body);
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

[**ApiResponseSubscriptionTableDTO**](ApiResponseSubscriptionTableDTO.md)

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


## updateSubscription

> ApiResponseSubscriptionTableDTO updateSubscription(id, subscriptionPutDTO)

Update a Subscription by id

### Example

```ts
import {
  Configuration,
  SubscriptionApi,
} from '';
import type { UpdateSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // SubscriptionPutDTO
    subscriptionPutDTO: ...,
  } satisfies UpdateSubscriptionRequest;

  try {
    const data = await api.updateSubscription(body);
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
| **subscriptionPutDTO** | [SubscriptionPutDTO](SubscriptionPutDTO.md) |  | |

### Return type

[**ApiResponseSubscriptionTableDTO**](ApiResponseSubscriptionTableDTO.md)

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


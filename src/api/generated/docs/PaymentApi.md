# PaymentApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createPayment**](PaymentApi.md#createpayment) | **POST** /api/payment | Create a new Payment |
| [**createPaymentMethod**](PaymentApi.md#createpaymentmethod) | **POST** /api/payment/method | Create a new Payment Method |
| [**deletePayment**](PaymentApi.md#deletepayment) | **DELETE** /api/payment/{id} | Delete a Payment by id |
| [**deletePaymentMethod**](PaymentApi.md#deletepaymentmethod) | **DELETE** /api/payment/method/{id} | Delete a Payment Method by id |
| [**getAllPaymentMethods**](PaymentApi.md#getallpaymentmethods) | **GET** /api/payment/method | Get all Payment Methods |
| [**getAllPayments**](PaymentApi.md#getallpayments) | **GET** /api/payment | Get all Payments |
| [**getPayment**](PaymentApi.md#getpayment) | **GET** /api/payment/{id} | Get a Payment by id |
| [**getPaymentMethod**](PaymentApi.md#getpaymentmethod) | **GET** /api/payment/method/{id} | Get a Payment Method with its Permissions by id |
| [**updatePayment**](PaymentApi.md#updatepayment) | **PUT** /api/payment/{id} | Update a Payment by id |
| [**updatePaymentMethod**](PaymentApi.md#updatepaymentmethod) | **PUT** /api/payment/method/{id} | Update a Payment Method by id |



## createPayment

> ApiResponsePaymentTableDTO createPayment(paymentPostDTO)

Create a new Payment

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { CreatePaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // PaymentPostDTO
    paymentPostDTO: ...,
  } satisfies CreatePaymentRequest;

  try {
    const data = await api.createPayment(body);
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
| **paymentPostDTO** | [PaymentPostDTO](PaymentPostDTO.md) |  | |

### Return type

[**ApiResponsePaymentTableDTO**](ApiResponsePaymentTableDTO.md)

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


## createPaymentMethod

> ApiResponsePaymentMethodTableDTO createPaymentMethod(paymentMethodPostDTO)

Create a new Payment Method

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { CreatePaymentMethodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // PaymentMethodPostDTO
    paymentMethodPostDTO: ...,
  } satisfies CreatePaymentMethodRequest;

  try {
    const data = await api.createPaymentMethod(body);
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
| **paymentMethodPostDTO** | [PaymentMethodPostDTO](PaymentMethodPostDTO.md) |  | |

### Return type

[**ApiResponsePaymentMethodTableDTO**](ApiResponsePaymentMethodTableDTO.md)

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


## deletePayment

> ApiResponseUnit deletePayment(id)

Delete a Payment by id

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { DeletePaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeletePaymentRequest;

  try {
    const data = await api.deletePayment(body);
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


## deletePaymentMethod

> ApiResponseUnit deletePaymentMethod(id)

Delete a Payment Method by id

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { DeletePaymentMethodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeletePaymentMethodRequest;

  try {
    const data = await api.deletePaymentMethod(body);
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


## getAllPaymentMethods

> ApiResponseListPaymentMethodTableDTO getAllPaymentMethods(pageable)

Get all Payment Methods

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { GetAllPaymentMethodsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllPaymentMethodsRequest;

  try {
    const data = await api.getAllPaymentMethods(body);
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

[**ApiResponseListPaymentMethodTableDTO**](ApiResponseListPaymentMethodTableDTO.md)

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


## getAllPayments

> ApiResponseListPaymentTableDTO getAllPayments(pageable)

Get all Payments

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { GetAllPaymentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllPaymentsRequest;

  try {
    const data = await api.getAllPayments(body);
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

[**ApiResponseListPaymentTableDTO**](ApiResponseListPaymentTableDTO.md)

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


## getPayment

> ApiResponsePaymentTableDTO getPayment(id)

Get a Payment by id

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { GetPaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetPaymentRequest;

  try {
    const data = await api.getPayment(body);
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

[**ApiResponsePaymentTableDTO**](ApiResponsePaymentTableDTO.md)

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


## getPaymentMethod

> ApiResponsePaymentMethodTableDTO getPaymentMethod(id)

Get a Payment Method with its Permissions by id

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { GetPaymentMethodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetPaymentMethodRequest;

  try {
    const data = await api.getPaymentMethod(body);
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

[**ApiResponsePaymentMethodTableDTO**](ApiResponsePaymentMethodTableDTO.md)

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


## updatePayment

> ApiResponsePaymentTableDTO updatePayment(id, paymentPutDTO)

Update a Payment by id

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { UpdatePaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // PaymentPutDTO
    paymentPutDTO: ...,
  } satisfies UpdatePaymentRequest;

  try {
    const data = await api.updatePayment(body);
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
| **paymentPutDTO** | [PaymentPutDTO](PaymentPutDTO.md) |  | |

### Return type

[**ApiResponsePaymentTableDTO**](ApiResponsePaymentTableDTO.md)

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


## updatePaymentMethod

> ApiResponsePaymentMethodTableDTO updatePaymentMethod(id, paymentMethodPutDTO)

Update a Payment Method by id

### Example

```ts
import {
  Configuration,
  PaymentApi,
} from '';
import type { UpdatePaymentMethodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // PaymentMethodPutDTO
    paymentMethodPutDTO: ...,
  } satisfies UpdatePaymentMethodRequest;

  try {
    const data = await api.updatePaymentMethod(body);
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
| **paymentMethodPutDTO** | [PaymentMethodPutDTO](PaymentMethodPutDTO.md) |  | |

### Return type

[**ApiResponsePaymentMethodTableDTO**](ApiResponsePaymentMethodTableDTO.md)

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


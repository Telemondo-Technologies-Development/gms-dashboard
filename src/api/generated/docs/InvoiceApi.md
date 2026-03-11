# InvoiceApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createInvoice**](InvoiceApi.md#createinvoice) | **POST** /api/invoice | Create a new Invoice |
| [**deleteInvoice**](InvoiceApi.md#deleteinvoice) | **DELETE** /api/invoice/{id} | Delete an Invoice by id |
| [**getAllInvoices**](InvoiceApi.md#getallinvoices) | **GET** /api/invoice | Get all Invoices |
| [**getInvoice**](InvoiceApi.md#getinvoice) | **GET** /api/invoice/{id} | Get an Invoice by id |
| [**updateInvoice**](InvoiceApi.md#updateinvoice) | **PUT** /api/invoice/{id} | Update an Invoice by id |



## createInvoice

> ApiResponseInvoiceTableDTO createInvoice(invoicePostDTO)

Create a new Invoice

### Example

```ts
import {
  Configuration,
  InvoiceApi,
} from '';
import type { CreateInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InvoiceApi();

  const body = {
    // InvoicePostDTO
    invoicePostDTO: ...,
  } satisfies CreateInvoiceRequest;

  try {
    const data = await api.createInvoice(body);
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
| **invoicePostDTO** | [InvoicePostDTO](InvoicePostDTO.md) |  | |

### Return type

[**ApiResponseInvoiceTableDTO**](ApiResponseInvoiceTableDTO.md)

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


## deleteInvoice

> ApiResponseUnit deleteInvoice(id)

Delete an Invoice by id

### Example

```ts
import {
  Configuration,
  InvoiceApi,
} from '';
import type { DeleteInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InvoiceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteInvoiceRequest;

  try {
    const data = await api.deleteInvoice(body);
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


## getAllInvoices

> ApiResponseListInvoiceTableDTO getAllInvoices(pageable)

Get all Invoices

### Example

```ts
import {
  Configuration,
  InvoiceApi,
} from '';
import type { GetAllInvoicesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InvoiceApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllInvoicesRequest;

  try {
    const data = await api.getAllInvoices(body);
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

[**ApiResponseListInvoiceTableDTO**](ApiResponseListInvoiceTableDTO.md)

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


## getInvoice

> ApiResponseInvoiceTableDTO getInvoice(id)

Get an Invoice by id

### Example

```ts
import {
  Configuration,
  InvoiceApi,
} from '';
import type { GetInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InvoiceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetInvoiceRequest;

  try {
    const data = await api.getInvoice(body);
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

[**ApiResponseInvoiceTableDTO**](ApiResponseInvoiceTableDTO.md)

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


## updateInvoice

> ApiResponseInvoiceTableDTO updateInvoice(id, invoicePutDTO)

Update an Invoice by id

### Example

```ts
import {
  Configuration,
  InvoiceApi,
} from '';
import type { UpdateInvoiceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InvoiceApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // InvoicePutDTO
    invoicePutDTO: ...,
  } satisfies UpdateInvoiceRequest;

  try {
    const data = await api.updateInvoice(body);
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
| **invoicePutDTO** | [InvoicePutDTO](InvoicePutDTO.md) |  | |

### Return type

[**ApiResponseInvoiceTableDTO**](ApiResponseInvoiceTableDTO.md)

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


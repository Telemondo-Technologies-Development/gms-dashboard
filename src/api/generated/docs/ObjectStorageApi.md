# ObjectStorageApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteFile**](ObjectStorageApi.md#deletefile) | **DELETE** /api/storage/{id} | delete a file from object storage and database |
| [**getUrl**](ObjectStorageApi.md#geturl) | **GET** /api/storage/{id}/url | Get a file from the object storage by ID |
| [**uploadAssetDocument**](ObjectStorageApi.md#uploadassetdocument) | **POST** /api/storage/upload/asset/document | (private) |
| [**uploadExpenseReceipt**](ObjectStorageApi.md#uploadexpensereceipt) | **POST** /api/storage/upload/expense/receipt | (private) |
| [**uploadFile**](ObjectStorageApi.md#uploadfile) | **POST** /api/storage/upload | Upload a file into the object storage |
| [**uploadMaintenanceRecord**](ObjectStorageApi.md#uploadmaintenancerecord) | **POST** /api/storage/upload/asset/maintenance | (private) |
| [**uploadPaymentMethodDoc**](ObjectStorageApi.md#uploadpaymentmethoddoc) | **POST** /api/storage/upload/payment-method/doc | (private) |
| [**uploadReportAttachment**](ObjectStorageApi.md#uploadreportattachment) | **POST** /api/storage/upload/report/attachment | (private) |
| [**uploadSupplyLogAttachment**](ObjectStorageApi.md#uploadsupplylogattachment) | **POST** /api/storage/upload/supply/log | (private) |
| [**uploadSupplyPhoto**](ObjectStorageApi.md#uploadsupplyphoto) | **POST** /api/storage/upload/supply/document | (private) |



## deleteFile

> ApiResponseUnit deleteFile(id)

delete a file from object storage and database

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { DeleteFileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteFileRequest;

  try {
    const data = await api.deleteFile(body);
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


## getUrl

> ApiResponseString getUrl(id)

Get a file from the object storage by ID

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { GetUrlRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetUrlRequest;

  try {
    const data = await api.getUrl(body);
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

[**ApiResponseString**](ApiResponseString.md)

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


## uploadAssetDocument

> ApiResponseObjectStorage uploadAssetDocument(uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadAssetDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadAssetDocumentRequest;

  try {
    const data = await api.uploadAssetDocument(body);
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


## uploadExpenseReceipt

> ApiResponseObjectStorage uploadExpenseReceipt(category, uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadExpenseReceiptRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // string
    category: category_example,
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadExpenseReceiptRequest;

  try {
    const data = await api.uploadExpenseReceipt(body);
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
| **category** | `string` |  | [Defaults to `undefined`] |
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


## uploadFile

> ApiResponseObjectStorage uploadFile(bucket, path, uploadBranchLogoRequest)

Upload a file into the object storage

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadFileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // string
    bucket: bucket_example,
    // string
    path: path_example,
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadFileRequest;

  try {
    const data = await api.uploadFile(body);
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
| **bucket** | `string` |  | [Defaults to `undefined`] |
| **path** | `string` |  | [Defaults to `undefined`] |
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


## uploadMaintenanceRecord

> ApiResponseObjectStorage uploadMaintenanceRecord(uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadMaintenanceRecordRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadMaintenanceRecordRequest;

  try {
    const data = await api.uploadMaintenanceRecord(body);
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


## uploadPaymentMethodDoc

> ApiResponseObjectStorage uploadPaymentMethodDoc(uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadPaymentMethodDocRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadPaymentMethodDocRequest;

  try {
    const data = await api.uploadPaymentMethodDoc(body);
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


## uploadReportAttachment

> ApiResponseObjectStorage uploadReportAttachment(uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadReportAttachmentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadReportAttachmentRequest;

  try {
    const data = await api.uploadReportAttachment(body);
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


## uploadSupplyLogAttachment

> ApiResponseObjectStorage uploadSupplyLogAttachment(uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadSupplyLogAttachmentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadSupplyLogAttachmentRequest;

  try {
    const data = await api.uploadSupplyLogAttachment(body);
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


## uploadSupplyPhoto

> ApiResponseObjectStorage uploadSupplyPhoto(uploadBranchLogoRequest)

(private)

### Example

```ts
import {
  Configuration,
  ObjectStorageApi,
} from '';
import type { UploadSupplyPhotoRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ObjectStorageApi();

  const body = {
    // UploadBranchLogoRequest (optional)
    uploadBranchLogoRequest: ...,
  } satisfies UploadSupplyPhotoRequest;

  try {
    const data = await api.uploadSupplyPhoto(body);
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


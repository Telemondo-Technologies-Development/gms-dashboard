# BrandApi

All URIs are relative to *http://localhost:8080*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createBrand**](BrandApi.md#createbrand) | **POST** /api/asset/brand | Create a Brand Category |
| [**deleteBrand**](BrandApi.md#deletebrand) | **DELETE** /api/asset/brand/{id} | Delete a Brand by id |
| [**getAllBrands**](BrandApi.md#getallbrands) | **GET** /api/asset/brand | Get all Brands |
| [**getBrand**](BrandApi.md#getbrand) | **GET** /api/asset/brand/{id} | Get a Brand by id |
| [**updateBrand**](BrandApi.md#updatebrand) | **PUT** /api/asset/brand/{id} | Update a Brand by id |



## createBrand

> ApiResponseBrandTableDTO createBrand(brandPostDTO)

Create a Brand Category

### Example

```ts
import {
  Configuration,
  BrandApi,
} from '';
import type { CreateBrandRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BrandApi();

  const body = {
    // BrandPostDTO
    brandPostDTO: ...,
  } satisfies CreateBrandRequest;

  try {
    const data = await api.createBrand(body);
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
| **brandPostDTO** | [BrandPostDTO](BrandPostDTO.md) |  | |

### Return type

[**ApiResponseBrandTableDTO**](ApiResponseBrandTableDTO.md)

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


## deleteBrand

> ApiResponseUnit deleteBrand(id)

Delete a Brand by id

### Example

```ts
import {
  Configuration,
  BrandApi,
} from '';
import type { DeleteBrandRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BrandApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies DeleteBrandRequest;

  try {
    const data = await api.deleteBrand(body);
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


## getAllBrands

> ApiResponseListBrandTableDTO getAllBrands(pageable)

Get all Brands

### Example

```ts
import {
  Configuration,
  BrandApi,
} from '';
import type { GetAllBrandsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BrandApi();

  const body = {
    // Pageable
    pageable: ...,
  } satisfies GetAllBrandsRequest;

  try {
    const data = await api.getAllBrands(body);
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

[**ApiResponseListBrandTableDTO**](ApiResponseListBrandTableDTO.md)

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


## getBrand

> ApiResponseBrandTableDTO getBrand(id)

Get a Brand by id

### Example

```ts
import {
  Configuration,
  BrandApi,
} from '';
import type { GetBrandRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BrandApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies GetBrandRequest;

  try {
    const data = await api.getBrand(body);
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

[**ApiResponseBrandTableDTO**](ApiResponseBrandTableDTO.md)

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


## updateBrand

> ApiResponseBrandTableDTO updateBrand(id, brandPutDTO)

Update a Brand by id

### Example

```ts
import {
  Configuration,
  BrandApi,
} from '';
import type { UpdateBrandRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BrandApi();

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // BrandPutDTO
    brandPutDTO: ...,
  } satisfies UpdateBrandRequest;

  try {
    const data = await api.updateBrand(body);
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
| **brandPutDTO** | [BrandPutDTO](BrandPutDTO.md) |  | |

### Return type

[**ApiResponseBrandTableDTO**](ApiResponseBrandTableDTO.md)

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


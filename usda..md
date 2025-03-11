# FoodData Central API Guide

## Overview

The FoodData Central API provides REST access to FoodData Central (FDC), intended primarily for application developers wishing to incorporate nutrient data into their applications or websites.

Developers should familiarize themselves with the database by reading the documentation available via links on Data Type Documentation to understand the data elements referenced in the API.

> **Note:** The API from the USDA Food Composition Databases website is discontinued as of March 31, 2020. Users should use this new FoodData Central API system.

## What's Available

The API provides two main endpoints:

- **Food Search endpoint:** Returns foods matching desired search criteria
- **Food Details endpoint:** Returns details on a particular food

## Gaining Access

Anyone may access the API, but a data.gov API key must be included in each request. [Sign up to obtain a key](https://api.data.gov/signup/), then follow the instructions for usage.

## Rate Limits

- Default: 1,000 requests per hour per IP address
- Exceeding this limit will cause temporary blocking for 1 hour
- Contact FoodData Central if higher request rates are needed
- More information: [https://api.data.gov/docs/rate-limits](https://api.data.gov/docs/rate-limits)

## Licensing

USDA FoodData Central data are in the public domain under [CC0 1.0 Universal (CC0 1.0)](https://creativecommons.org/publicdomain/zero/1.0/).

**Suggested citation:**

> U.S. Department of Agriculture, Agricultural Research Service. FoodData Central, 2019. fdc.nal.usda.gov.

## API Endpoints

| URL             | Verb     | Purpose                                                     |
| --------------- | -------- | ----------------------------------------------------------- |
| `/food/{fdcId}` | GET      | Fetches details for one food item by FDC ID                 |
| `/foods`        | GET/POST | Fetches details for multiple food items using input FDC IDs |
| `/foods/list`   | GET/POST | Returns a paged list of foods in 'abridged' format          |
| `/foods/search` | GET/POST | Returns a list of foods that matched search keywords        |

## Sample Calls

**Note:** These examples use `DEMO_KEY` which has lower rate limits than a registered key.

### GET Requests:

```bash
curl https://api.nal.usda.gov/fdc/v1/food/######?api_key=DEMO_KEY
curl https://api.nal.usda.gov/fdc/v1/foods/list?api_key=DEMO_KEY
curl https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query=Cheddar%20Cheese
```

### POST Requests:

```bash
curl -XPOST -H "Content-Type:application/json" -d '{"pageSize":25}' https://api.nal.usda.gov/fdc/v1/foods/list?api_key=DEMO_KEY

curl -XPOST -H "Content-Type:application/json" -d '{"query":"Cheddar cheese"}' https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY

# Windows example
curl -XPOST -H "Content-Type:application/json" -d "{\"query\":\"Cheddar cheese\"}" https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY

# With parameters
curl -XPOST -H "Content-Type:application/json" -d '{"query": "Cheddar cheese", "dataType": ["Branded"], "sortBy": "fdcId", "sortOrder": "desc"}' https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY
```

## API Specification

The OpenAPI v3 spec is available in HTML, JSON, or YAML formats, and on [SwaggerHub](https://app.swaggerhub.com/apis/fdcnal/food-data_central_api/1.0.1).

## Contact Information

- [Contact FoodData Central](https://fdc.nal.usda.gov/contact-page.html)
- [AskUSDA](https://ask.usda.gov/)

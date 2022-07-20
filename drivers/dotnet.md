---
layout: default
title: ArangoDB C#/.NET Driver
---
# ArangoDB C#/.NET Driver

The official ArangoDB C#/.NET driver. Built using .NET Standard 2.0, the library provides .NET Core and .NET Framework applications with the complete range of features exposed by the ArangoDB REST API.

The library provides comprehensive coverage of all of the available options for each of ArangoDB's REST API endpoints.

The driver is built using the standard [HttpClient](https://docs.microsoft.com/en-us/dotnet/api/system.net.http.httpclient?view=netstandard-2.0) interface for making HTTP requests, along with [Json.NET](https://www.newtonsoft.com/json) for (de)serialization to/from CLI types.

In addition the library provides:

- Support for async/await across every API operation
- Adherence to common-practice C# naming conventions
- Consistent approach for each API endpoint

## What's New In [Version 1.1.1](https://github.com/ArangoDB-Community/arangodb-net-standard/releases)
- Support for [ArangoDB Oasis](https://cloud.arangodb.com/home)
- Support for additional AQL/Query features.
- Support for additional Collection API features.
- Support for Indexes API features.
- Support for Views API features.
- Support for Analyzers API features.
- Support for Bulk Operations API features.
- Support for some critical Admin API features.
- Several bug fixes and improvements on previous versions.
---
layout: default
---

# Getting Started

## Installation

The ArangoDBNetStandard library can be consumed in any .NET project that targets .NET Standard 2.0 or a version of .NET that is compliant with .NET Standard 2.0.

### Nuget

To install from Nuget:

1. Open the latest release of
[ArangoDBNetStandard on Nuget](https://www.nuget.org/packages/ArangoDBNetStandard){:target="_blank"}.
2. Install the latest version of the Nuget package into your project using [.NET CLI](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-using-the-dotnet-cli){:target="_blank"}, [Visual Studio](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-in-visual-studio){:target="_blank"} or [Visual Studio for Mac](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-in-visual-studio-mac){:target="_blank"}.

### GitHub

To install from Github:

1. Open the latest [Github release of ArangoDBNetStandard](https://github.com/ArangoDB-Community/arangodb-net-standard/releases){:target="_blank"}.
2. Scroll to the **Assets** section.
3. Download the source files. They are available as either a zip or tar.gz archive file.
4. Extract the source files from the archive file downloaded in step 3.
5. Build the **\arangodb-net-standard\ArangoDBNetStandard.csproj** project for release using the .NET CLI or Visual Studio.
6. In the project that will consume the driver library, add a reference to the build output (the **ArangoDBNetStandard.dll** assembly located in the **\arangodb-net-standard\bin\Release\netstandard2.0** folder).

## First Steps

Learn how to:

1. Work with [databases](dotnet-databases.html).
2. Work with [collections](dotnet-collections.html).
3. Work with [documents](dotnet-documents.html).
4. Work with [AQL queries and functions](dotnet-aql.html).

## Reference

Browse the full reference for [ArangoDBNetStandard](https://arangodb-community.github.io/arangodb-net-standard/){:target="_blank"}.
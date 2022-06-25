---
layout: default
---
# Installation
The ArangoDBNetStandard library can be consumed in any .NET project that targets .NET Standard 2.0 or a version of .NET that is compliant with .NET Standard 2.0.

## Nuget

To install from Nuget:
1. Browse to the latest release of
[ArangoDBNetStandard on Nuget](https://www.nuget.org/packages/ArangoDBNetStandard){:target="_blank"}.
2. Install the latest version of the Nuget package to your project by [.NET CLI](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-using-the-dotnet-cli){:target="_blank"}, [Visual Studio](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-in-visual-studio){:target="_blank"} or [Visual Studio for Mac](https://docs.microsoft.com/en-us/nuget/quickstart/install-and-use-a-package-in-visual-studio-mac){:target="_blank"}.

## GitHub

To install from Github
1. Browse to the [latest Github release of ArangoDBNetStandard](https://github.com/ArangoDB-Community/arangodb-net-standard/releases){:target="_blank"}.
2. Scroll to the Assets section.
3. Download the source files. They are available in either a zip or tar.gz archive file.
4. Extract the source files from the archive file downloaded in step 3.
5. Build the project \arangodb-net-standard\ArangoDBNetStandard.csproj for release using the .NET CLI or Visual Studio.
6. In the project that will consume the driver library, add a reference to the build output (the assembly ArangoDBNetStandard.dll located in the folder \arangodb-net-standard\bin\Release\netstandard2.0).

---
layout: default
description: ArangoDB v3.7 Release Notes New Features
---
Features and Improvements in ArangoDB 3.7
=========================================

The following list shows in detail which features have been added or improved in
ArangoDB 3.7. ArangoDB 3.7 also contains several bug fixes that are not listed
here.

### Insert-Update

ArangoDB 3.7 adds an insert-update operation that is similar to the already
existing insert-replace functionality. Thew new `overwriteMode` flag has been
introduced to control the type of the overwrite operation in case of colliding
keys during the insert. Furthermore the insert now takes the *keepNull* and
*mergeObjects* parameters to provide more control over the update operation.

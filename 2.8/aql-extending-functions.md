---
layout: default
description: AQL user functions can be registered  in the selected database using the aqlfunctions object as follows
---
Registering and Unregistering User Functions
============================================

AQL user functions can be registered  in the selected database 
using the *aqlfunctions* object as follows:

```js
var aqlfunctions = require("org/arangodb/aql/functions");
```

To register a function, the fully qualified function name plus the
function code must be specified.

### Register
<!-- js/common/modules/org/arangodb/aql/functions.js -->
{% docublock aqlFunctionsRegister %}

### Unregister
<!-- js/common/modules/org/arangodb/aql/functions.js -->
{% docublock aqlFunctionsUnregister %}

### Unregister Group
<!-- js/common/modules/org/arangodb/aql/functions.js -->
{% docublock aqlFunctionsUnregisterGroup %}

### To Array
<!-- js/common/modules/org/arangodb/aql/functions.js -->
{% docublock aqlFunctionsToArray %}
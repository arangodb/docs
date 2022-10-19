package utils

import "fmt"

/*
	These functions are a porting from the arangodb old toolchain defined in exampleHeader.js and client/internal.js
	used for example generation
*/

func TryCatchWrap(code string) string {
	return fmt.Sprintf("try {\n%s\n} catch(err) {\n print('ERROR ' + err.errorNum + ' on ' + err.stack);\n }", code)
}

func LogCurlRequest(args string) string {
	printReq := fmt.Sprintf("print('REQUEST');\nprint([%s]);\nprint('END REQUEST');", args)
	swallowTextFunc := "var swallowText = function () {};"
	appendCurlRequest := "var curlRequestRaw = internal.appendCurlRequest(swallowText, swallowText, swallowText);"
	response := fmt.Sprintf("var response = curlRequestRaw.apply(curlRequestRaw, [%s]);", args)

	return fmt.Sprintf("%s\n%s\n%s\n%s\n", printReq, swallowTextFunc, appendCurlRequest, response)
}

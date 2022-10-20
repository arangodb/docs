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
	curlRequest := fmt.Sprintf("print('REQUEST');\nprint([%s]);\nprint('END REQUEST');\n"+
		"var swallowText = function () {};\n"+
		"var curlRequestRaw = internal.appendCurlRequest(swallowText, swallowText, swallowText);\n"+
		"var response = curlRequestRaw.apply(curlRequestRaw, [%s]);", args, args)

	return fmt.Sprintf("%s\n", curlRequest)
}

func LogJsonResponse() string {
	jsonResponse := fmt.Sprintf(
		"output = '';\n" +
			"const rawAppender = function(text) {output += text;};\n" +
			"var logJsonResponse = internal.appendJsonResponse(rawAppender, rawAppender);\n" +
			"logJsonResponse.apply(logJsonResponse, [response]);\n" +
			"print('RESPONSE');\noutput;\nprint('END RESPONSE');\n")
	return jsonResponse
}

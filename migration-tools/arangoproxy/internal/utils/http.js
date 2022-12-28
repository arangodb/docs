
var internal = require('internal');
var print = require('@arangodb').print;
var errors = require("@arangodb").errors;
var time = require("internal").time;
var fs = require('fs');
var ArangoshOutput = {};
var allErrors = '';
var output = '';
var XXX = '';
var testFunc;
var countErrors;
var collectionAlreadyThere = [];
var ignoreCollectionAlreadyThere = [];
var rc;
var j;


const exds = require("@arangodb/examples/examples").Examples;

const hljs = require('highlight.js');

const MAP = {
    'py': 'python',
    'js': 'javascript',
    'json': 'javascript',
    'rb': 'ruby',
    'csharp': 'cs',
};

function normalize(lang) {
    if(!lang) { return null; }

    var lower = lang.toLowerCase();
    return MAP[lower] || lower;
}

function highlight(language, code) {
  if(!language) {
    return code;
  }
  // Normalize language
  language = normalize(language);

  try {
    return hljs.highlight(code, {language}).value;
  } catch(e) { }

  return code;
}


internal.startPrettyPrint(true);
internal.stopColorPrint(true);
var appender = function(text) {
  output += text;
};
const jsonAppender = function(text) {
  output += highlight("js", text);
};
const jsonLAppender = function(text) {
  output += highlight("js", text) + "&#x21A9;\n" ;
};
const htmlAppender = function(text) {
  output += highlight("html", text);
};
const rawAppender = function(text) {
  output += text;
};

const plainAppender = function(text) {
  // do we have a line that could be json? try to parse & format it.
  if (text.match(/^{.*}$/) || text.match(/^[.*]$/)) {
    try {
      let parsed = JSON.parse(text);
      output += highlight("js", internal.inspect(parsed)) + "&#x21A9;\n" ;
    } catch (x) {
      // fallback to plain text.
      output += text;
    }
  } else {
    output += text;
  }
};

const shellAppender = function(text) {
  output += highlight("shell", text);
};
const log = function (a) {
  internal.startCaptureMode();
  print(a);
  appender(internal.stopCaptureMode());
};

var appendCurlRequest = function (shellAppender, jsonAppender, rawAppender) {
  return function (method, url, body, headers) {
    var response;
    var curl;
    var jsonBody = false;

    if ((typeof body !== 'string') && (body !== undefined)) {
      jsonBody = true;
    }
    if (headers === undefined || headers === null || headers === '') {
      headers = {};
    }
    if (!headers.hasOwnProperty('Accept') && !headers.hasOwnProperty('accept')) {
      headers['accept'] = 'application/json';
    }

    curl = 'curl ';

    if (method === 'POST') {
      response = internal.arango.POST_RAW(url, body, headers);
      curl += '-X ' + method + ' ';
    } else if (method === 'PUT') {
      response = internal.arango.PUT_RAW(url, body, headers);
      curl += '-X ' + method + ' ';
    } else if (method === 'GET') {
      response = internal.arango.GET_RAW(url, headers);
    } else if (method === 'DELETE') {
      response = internal.arango.DELETE_RAW(url, body, headers);
      curl += '-X ' + method + ' ';
    } else if (method === 'PATCH') {
      response = internal.arango.PATCH_RAW(url, body, headers);
      curl += '-X ' + method + ' ';
    } else if (method === 'HEAD') {
      response = internal.arango.HEAD_RAW(url, headers);
      curl += '-X ' + method + ' ';
    } else if (method === 'OPTION' || method === 'OPTIONS') {
      response = internal.arango.OPTION_RAW(url, body, headers);
      curl += '-X ' + method + ' ';
    }
    if (headers !== undefined && headers !== '') {
      for (let i in headers) {
        if (headers.hasOwnProperty(i)) {
          curl += "--header '" + i + ': ' + headers[i] + "' ";
        }
      }
    }

    if (body !== undefined && body !== '') {
      curl += '--data-binary @- ';
    }

    curl += '--dump - http://localhost:8529' + url;

    if (body !== undefined && body !== '' && body) {
      curl += '\n'+JSON.stringify(body);
    }

    print("REQ");
    print(curl);
    print("ENDREQ");
    return response;
  };
};

  

var logCurlRequestRaw = appendCurlRequest(shellAppender, jsonAppender, rawAppender);
var logCurlRequest = function () {
  if ((arguments.length > 1) &&
      (arguments[1] !== undefined) &&
      (arguments[1].length > 0) &&
      (arguments[1][0] !== '/')) {
      throw new Error("your URL doesn't start with a /! the example will be broken. [" + arguments[1] + "]");
  }
  var r = logCurlRequestRaw.apply(logCurlRequestRaw, arguments);
  db._collections();
  return r;
};

var logJsonResponseRaw = internal.appendJsonResponse(rawAppender, rawAppender);
var logJsonResponse = function (response) {
  var r = logJsonResponseRaw.apply(logJsonResponseRaw, [response]);
  print("RESP");
  print(output);
  print("ENDRESP");
  output = "";
};

var logErrorResponse = function (response) {
    allErrors += "Server reply was: " + JSON.stringify(response) + "\n";
};
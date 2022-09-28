package common

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

type ExampleType string
type RenderType string

const (
	JS   ExampleType = "js"
	AQL  ExampleType = "aql"
	HTTP ExampleType = "http"

	INPUT        RenderType = "input"
	OUTPUT       RenderType = "output"
	INPUT_OUTPUT RenderType = "input/output"
)

type Example struct {
	Type    ExampleType    `json:"type"`
	Options ExampleOptions `json:"options"`
	Code    string         `json:"code"`
}

type ExampleOptions struct {
	Name     string                 `yaml:"name" json:"name"`
	Run      bool                   `yaml:"run" json:"run"`
	Version  string                 `yaml:"version" json:"version"`
	Release  string                 `yaml:"release" json:"release"`
	Render   RenderType             `yaml:"render" json:"render"`
	Explain  bool                   `yaml:"explain" json:"explain"`
	BindVars map[string]interface{} `yaml:"bindVars" json:"bindVars"`
	Dataset  string                 `yaml:"dataset" json:"dataset"`
}

func ParseExample(request io.Reader, exampleType ExampleType) (Example, error) {
	req, err := ioutil.ReadAll(request)
	if err != nil {
		Logger.Printf("Error reading Example body: %s\n", err.Error())
		return Example{}, err
	}

	r, err := regexp.Compile("---[\\w\\s\\W]*---")
	if err != nil {
		return Example{}, fmt.Errorf("ParseExample error compiling regex: %s", err.Error())
	}

	options := r.Find(req)
	optionsYaml := ExampleOptions{}
	err = yaml.Unmarshal(options, &optionsYaml)
	if err != nil {
		return Example{}, fmt.Errorf("ParseExample error parsing options: %s", err.Error())
	}

	code := strings.Replace(string(req), string(options), "", -1)

	codeComments := regexp.MustCompile(`(?m)~.*`)
	code = codeComments.ReplaceAllString(code, "")

	return Example{Type: exampleType, Options: optionsYaml, Code: code}, nil
}

func (r Example) String() string {
	j, err := json.Marshal(r)
	if err != nil {
		return ""
	}

	return string(j)
}

func (r ExampleOptions) String() string {
	j, err := json.Marshal(r)
	if err != nil {
		return ""
	}

	return string(j)
}

type ExampleResponse struct {
	Input   string         `json:"input"`
	Output  string         `json:"output"`
	Error   string         `json:"error"`
	Options ExampleOptions `json:"options"`
}

func (r ExampleResponse) String() string {
	j, err := json.Marshal(r)
	if err != nil {
		return ""
	}

	return string(j)
}

package common

import (
	"fmt"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

type ExampleType string
type RenderType string

const (
	JS  ExampleType = "js"
	AQL ExampleType = "aql"

	INPUT        RenderType = "input"
	OUTPUT       RenderType = "output"
	INPUT_OUTPUT RenderType = "input/output"
)

type Request struct {
	Type    ExampleType
	Options RequestOptions
	Code    string
}

type RequestOptions struct {
	Name    string     `yaml:"name"`
	Run     bool       `yaml:"run"`
	Version string     `yaml:"version"`
	Release string     `yaml:"release"`
	Render  RenderType `yaml:"render"`
}

func ParseRequest(request []byte, exampleType ExampleType) (Request, error) {
	r, err := regexp.Compile("---[\\w\\s\\W]*---")
	if err != nil {
		return Request{}, fmt.Errorf("ParseRequest error compiling regex: %s", err.Error())
	}

	options := r.Find(request)
	optionsYaml := RequestOptions{}
	err = yaml.Unmarshal(options, &optionsYaml)
	if err != nil {
		return Request{}, fmt.Errorf("ParseRequest error parsing options: %s", err.Error())
	}

	code := strings.Replace(string(request), string(options), "", -1)

	return Request{Type: exampleType, Options: optionsYaml, Code: code}, nil
}

func (r Request) String() string {
	return fmt.Sprintf("%s\nfunction %s() {%s\n}", r.Options, r.Options.Name, r.Code)
}

func (r RequestOptions) String() string {
	return fmt.Sprintf("//run: %v\n//version: %s", r.Run, r.Version)
}

type Response struct {
	Input  string `json:"input"`
	Output string `json:"output"`
	Error  string `json:"error"`
}

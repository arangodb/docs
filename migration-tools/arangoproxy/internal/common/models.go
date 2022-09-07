package common

import (
	"fmt"
	"regexp"
	"strings"

	"gopkg.in/yaml.v3"
)

type Request struct {
	Options RequestOptions
	Code    string
}

type RequestOptions struct {
	Name string `yaml:"name"`
	Run  bool   `yaml:"run"`
}

func ParseRequest(request []byte) (Request, error) {
	r, err := regexp.Compile("---[\\w\\s\\W]*---")
	if err != nil {
		return Request{}, fmt.Errorf("ParseRequest error compiling regex: %s", err.Error())
	}

	options := r.Find(request)
	fmt.Printf("ParseRequest options: %s", options)
	optionsYaml := RequestOptions{}
	err = yaml.Unmarshal(options, &optionsYaml)
	if err != nil {
		return Request{}, fmt.Errorf("ParseRequest error parsing options: %s", err.Error())
	}

	code := strings.Replace(string(request), string(options), "", -1)
	fmt.Printf("ParseRequest code: %s", code)

	return Request{Options: optionsYaml, Code: code}, nil
}

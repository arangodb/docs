package config

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	WebServer    string       `json:"webserver"`
	Repositories []Repository `json:"repositories"`
	Cache        CacheConfig  `json:"cache"`
	Log          string       `json:"logFile"`
	OpenApi      OpenApi      `json:"openapi"`
}

var Conf Config

func LoadConfig(file string) error {
	fileStream, err := ioutil.ReadFile(file)
	if err != nil {
		return err
	}

	err = json.Unmarshal(fileStream, &Conf)
	return err
}

type Repository struct {
	Name           string           `json:"name"`
	Url            string           `json:"url"`
	Authentication []Authentication `json:"authentications,omitempty"`
}

type OpenApi struct {
	ApiDocsFile    string `json:"apiDocsFile"`
	ComponentsFile string `json:"componentsFile"`
}

type CacheConfig struct {
	RequestsFile  string `json:"requestsFile"`
	ResponsesFile string `json:"responsesFile"`
}

type Authentication interface {
	Authenticate()
}

type UserPassAuthentication struct {
	User string
	Pass string
}

func (auth UserPassAuthentication) Authenticate() {

}

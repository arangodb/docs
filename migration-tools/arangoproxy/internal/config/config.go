package config

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	WebServer    string       `json:"webserver"`    // Arangoproxy url+port
	Repositories []Repository `json:"repositories"` // ArangoDB instances
	Cache        CacheConfig  `json:"cache"`        // Cache configuration
	Log          string       `json:"logFile"`      // Logfile
	OpenApi      OpenApi      `json:"openapi"`      // OpenApi files configuration
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
	Type           string           `json:"type"` // ArangoDB instance type: nightly, release, stable ....
	Version        string           `json:"version"`
	Url            string           `json:"url"`                       // Instance URL+Port to connect to
	Authentication []Authentication `json:"authentications,omitempty"` // Instance authentication
	Password       string           `json:"password"`                  // Temporary workaround for authentication to be implemented
}

type OpenApi struct {
	ApiDocsFile    string `json:"apiDocsFile"`    // Filepath of the api-docs.json
	ComponentsFile string `json:"componentsFile"` // Filepath of the components.yaml file where common schemas are stored
}

type CacheConfig struct {
	RequestsFile  string `json:"requestsFile"`  // Fileapth of requests cache
	ResponsesFile string `json:"responsesFile"` // Filepath of responses cache
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

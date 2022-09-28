package common

import (
	"errors"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
)

// Check in the examples.txt hashes file if this example's hash is the same as before
func (service Service) IsCached(request Example) (bool, error) {
	hashName := fmt.Sprintf("%s_%s_%s", request.Options.Name, request.Options.Release, request.Options.Version)
	hashFile, err := os.ReadFile("./cache/requests.txt")
	if err != nil {
		fmt.Printf("Error opening file %s", err.Error())
		return false, err
	}

	exampleHash, err := utils.EncodeToBase64(request)

	if strings.Contains(string(hashFile), fmt.Sprintf("%s: %s", hashName, exampleHash)) {
		Logger.Print("[IsCached] Example is cached\n")
		return true, nil // Example has not been modified
	}

	f, err := os.OpenFile("./cache/requests.txt",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		Logger.Printf("[IsCached] Error Opening cache file: %s\n", err.Error())
		return false, err
	}

	defer f.Close()

	if _, err = f.WriteString(fmt.Sprintf("%s: %s\n", hashName, exampleHash)); err != nil {
		Logger.Printf("[IsCached] Error writing to cache file: %s", err.Error())
		return false, err
	}

	return false, nil
}

func (service Service) GetCachedExampleResponse(request Example) (ExampleResponse, error) {
	hashName := fmt.Sprintf("%s_%s_%s", request.Options.Name, request.Options.Release, request.Options.Version)
	hashFile, err := os.ReadFile("./cache/responses.txt")
	if err != nil {
		Logger.Printf("[GetCachedExampleResponse] Error opening cache file: %s\n", err.Error())
		return ExampleResponse{}, err
	}

	re := regexp.MustCompile(fmt.Sprintf(`(?m)%s:.*`, hashName))
	hashedRes := re.FindString(string(hashFile))
	if hashedRes == "" {
		return ExampleResponse{}, errors.New("Cached ExampleResponse not found")
	}

	res := ExampleResponse{}
	b64Body := strings.Split(hashedRes, ":")[1]
	err = utils.DecodeFromBase64(&res, b64Body)
	return res, err
}

func (service Service) SaveCachedExampleResponse(ExampleResponse ExampleResponse) error {
	hashName := fmt.Sprintf("%s_%s_%s", ExampleResponse.Options.Name, ExampleResponse.Options.Release, ExampleResponse.Options.Version)
	exampleHash, err := utils.EncodeToBase64(ExampleResponse)

	f, err := os.OpenFile("./cache/responses.txt",
		os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println(err)
	}
	defer f.Close()
	_, err = f.WriteString(fmt.Sprintf("\n%s:%s", hashName, exampleHash))

	return err
}

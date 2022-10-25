package common

import (
	"bytes"
	"os/exec"
	"regexp"
	"strings"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/config"
	"github.com/arangodb/docs/migration-tools/arangoproxy/internal/utils"
	"github.com/dlclark/regexp2"
)

const ()

type Service struct{}

func Recover(functionName string) {
	if r := recover(); r != nil {
		Logger.Printf("[PANIC] Recovered panic in func %s:\nPanic Cause: %s\n\n", functionName, r)
	}
}

func (service Service) CleanUpTestCollections(code string, collectionsToIgnore *IgnoreCollections, repository config.Repository) {
	service.AddIgnoreCollections(code, collectionsToIgnore)
	service.RemoveIgnoreCollection(code, collectionsToIgnore)
	command := utils.RemoveAllTestCollections(collectionsToIgnore.ToIgnore)
	cmdName := "arangosh"
	cmdArgs := []string{"--configuration", "none",
		"--server.endpoint", repository.Url,
		"--server.password", repository.Password,
		"--javascript.startup-directory", "/usr/share/arangodb3/js"}

	cmd := exec.Command(cmdName, cmdArgs...)

	var out, er bytes.Buffer
	cmd.Stdin = strings.NewReader(command)
	cmd.Stdout = &out
	cmd.Stderr = &er

	cmd.Run()
}

func (service Service) AddIgnoreCollections(code string, collectionsToIgnore *IgnoreCollections) {
	addIgnoreRe := regexp.MustCompile(".*addIgnoreCollection.*")
	collections := addIgnoreRe.FindAllString(code, -1)

	for _, collection := range collections {
		collectionNameRe := regexp2.MustCompile("(?<=addIgnoreCollection\\(\").*(?=\"\\))", 0)
		collectionName, _ := collectionNameRe.FindStringMatch(collection)
		if collectionName == nil {
			continue
		}

		collectionsToIgnore.Mutex.Lock()
		collectionsToIgnore.ToIgnore = append(collectionsToIgnore.ToIgnore, collectionName.String())
		collectionsToIgnore.Mutex.Unlock()
	}
}

func (service Service) RemoveIgnoreCollection(code string, collectionsToIgnore *IgnoreCollections) {
	addIgnoreRe := regexp.MustCompile(".*removeIgnoreCollection.*")
	collections := addIgnoreRe.FindAllString(code, -1)

	for _, collection := range collections {
		collectionNameRe := regexp2.MustCompile("(?<=removeIgnoreCollection\\(\").*(?=\"\\))", 0)
		collectionName, _ := collectionNameRe.FindStringMatch(collection)
		if collectionName == nil {
			continue
		}

		collectionsToIgnore.Mutex.Lock()
		for _, coll := range collectionsToIgnore.ToIgnore {
			if coll == collectionName.String() {

			}
		}
		collectionsToIgnore.ToIgnore = append(collectionsToIgnore.ToIgnore, collectionName.String())
		collectionsToIgnore.Mutex.Unlock()
	}
}

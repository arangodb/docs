package common

import (
	"fmt"
	"regexp"

	"github.com/dlclark/regexp2"
)

const ()

type Service struct{}

func Recover(functionName string) {
	if r := recover(); r != nil {
		Logger.Printf("[PANIC] Recovered panic in func %s:\nPanic Cause: %s\n\n", functionName, r)
	}
}

func (service Service) HandleIgnoreCollections(code string, collectionsToIgnore *IgnoreCollections) string {
	code = service.AddIgnoreCollections(code, collectionsToIgnore)
	code = service.RemoveIgnoreCollection(code, collectionsToIgnore)
	ignoreCollections := "var toIgnore = ["

	for coll, toIgnore := range collectionsToIgnore.ToIgnore {
		if toIgnore == true {
			ignoreCollections = fmt.Sprintf("%s\"%s\",", ignoreCollections, coll)
		}
	}
	ignoreCollections = ignoreCollections + "];"
	code = ignoreCollections + "\n" + code
	return code
}

func (service Service) AddIgnoreCollections(code string, collectionsToIgnore *IgnoreCollections) string {
	addIgnoreRe := regexp.MustCompile(".*addIgnoreCollection.*")
	collections := addIgnoreRe.FindAllString(code, -1)

	code = addIgnoreRe.ReplaceAllString(code, "")

	for _, collection := range collections {
		collectionNameRe := regexp2.MustCompile("(?<=addIgnoreCollection\\(\").*(?=\"\\))", 0)
		collectionName, _ := collectionNameRe.FindStringMatch(collection)
		if collectionName == nil {
			continue
		}

		collectionsToIgnore.ToIgnore[collectionName.String()] = true
	}
	return code
}

func (service Service) RemoveIgnoreCollection(code string, collectionsToIgnore *IgnoreCollections) string {
	addIgnoreRe := regexp.MustCompile(`(?m).*removeIgnoreCollection.*`)
	collections := addIgnoreRe.FindAllString(code, -1)

	code = addIgnoreRe.ReplaceAllString(code, "")

	for _, collection := range collections {
		collectionNameRe := regexp2.MustCompile("(?<=removeIgnoreCollection\\(\").*(?=\"\\))", 0)
		collectionName, _ := collectionNameRe.FindStringMatch(collection)
		if collectionName == nil {
			continue
		}

		collectionsToIgnore.ToIgnore[collectionName.String()] = false
	}
	return code
}

package utils

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io/ioutil"
	"strings"

	"github.com/dlclark/regexp2"
)

func EncodeToBase64(v interface{}) (string, error) {
	var buf bytes.Buffer
	encoder := base64.NewEncoder(base64.StdEncoding, &buf)
	err := json.NewEncoder(encoder).Encode(v)
	if err != nil {
		return "", err
	}
	encoder.Close()
	return buf.String(), nil
}

func DecodeFromBase64(v interface{}, enc string) error {
	return json.NewDecoder(base64.NewDecoder(base64.StdEncoding, strings.NewReader(enc))).Decode(v)
}

func ReadFileAsMap(file string) (map[string]interface{}, error) {
	fileBytes, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, errors.New("[ReadFileAsMap] error reading file " + err.Error())
	}

	fileMap := make(map[string]interface{})
	err = json.Unmarshal(fileBytes, &fileMap)
	if err != nil {
		return nil, errors.New("[ReadFileAsMap] Error parsing file as map: " + err.Error())
	}

	return fileMap, nil
}

func Regexp2FindAllString(re *regexp2.Regexp, s string) []string {
	var matches []string
	m, _ := re.FindStringMatch(s)
	for m != nil {
		matches = append(matches, m.String())
		m, _ = re.FindNextMatch(m)
	}
	return matches
}

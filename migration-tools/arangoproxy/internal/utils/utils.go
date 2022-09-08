package utils

import (
	"fmt"
	"hash/fnv"
)

func CalculateHash(s string) string {
	h := fnv.New32a()
	h.Write([]byte(s))
	return fmt.Sprint(h.Sum32())
}

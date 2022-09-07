package main

import (
	"fmt"

	"github.com/arangodb/docs/migration-tools/arangoproxy/internal"
)

func main() {
	fmt.Println("Start")
	internal.StartController()
}

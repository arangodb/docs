package js

import "strings"

func formatRequestCode(code string) string {
	commands := strings.ReplaceAll(code, "~", "")
	return commands
}

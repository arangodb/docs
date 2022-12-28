package common

const ()

type Service struct{}

func Recover(functionName string) {
	if r := recover(); r != nil {
		Logger.Printf("[PANIC] Recovered panic in func %s:\nPanic Cause: %s\n\n", functionName, r)
	}
}

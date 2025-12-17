package utils

import (
	"errors"
	"path/filepath"
	"runtime"
)

// GetRelativePath relative to caller code-file's path
func GetRelativePath(relativePath string) (string, error) {
	if _, filename, _, ok := runtime.Caller(1); ok { // 1 == the caller of this function
		return filepath.Join(filepath.Dir(filename), relativePath), nil
	}
	return "", errors.New("failed to get current file directory")
}

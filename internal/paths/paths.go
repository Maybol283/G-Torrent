package paths

import (
	"regexp"
	"strings"
)

// invalidFilenameChars matches every character that Windows refuses
// in filenames, plus control characters. Linux is more permissive but
// we treat them all the same for portability.
var invalidFilenameChars = regexp.MustCompile(`[<>:"/\\|?*\x00-\x1f]`)

// Sanitise turns an arbitrary string (e.g. a YouTube title) into a
// safe filename stem. It does NOT add an extension.
func Sanitise(name string) string {
	cleaned := invalidFilenameChars.ReplaceAllString(name, "_")
	cleaned = strings.TrimRight(cleaned, ". ")
	if cleaned == "" {
		return "untitled"
	}
	return cleaned
}

//go:build !windows

package bin

// Non-Windows builds don't embed ffmpeg — users install it via the system
// package manager (Homebrew on macOS, apt/etc on Linux). These vars exist
// only so extract.go compiles on all platforms; the runtime.GOOS check
// in EnsureFfmpeg short-circuits before they're ever read.
var ffmpegBinary []byte
var ffmpegSHA256 string

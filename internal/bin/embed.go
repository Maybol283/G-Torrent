//go:build windows

package bin

import (
	"crypto/sha256"
	_ "embed"
	"encoding/hex"
)

//go:embed payload/ffmpeg.exe
var ffmpegBinary []byte

// ffmpegSHA256 is computed once at startup from the embedded bytes,
// so it always matches whatever ffmpeg.exe was bundled at build time
// (CI downloads a fresh copy each build).
var ffmpegSHA256 string

func init() {
	sum := sha256.Sum256(ffmpegBinary)
	ffmpegSHA256 = hex.EncodeToString(sum[:])
}

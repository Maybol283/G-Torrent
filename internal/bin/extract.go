package bin

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
)

// EnsureFfmpeg returns a path to a runnable ffmpeg binary.
// On Linux and macOS it returns "ffmpeg" (resolved from $PATH at exec time —
// users are expected to install ffmpeg via the system package manager).
// On Windows it extracts the embedded binary to %LOCALAPPDATA% and
// re-uses it on subsequent runs, hash-checked against ffmpegSHA256.
func EnsureFfmpeg(_ context.Context) (string, error) {
	if runtime.GOOS == "linux" || runtime.GOOS == "darwin" {
		return "ffmpeg", nil
	}

	cacheDir, err := os.UserCacheDir()
	if err != nil {
		return "", fmt.Errorf("locate cache dir: %w", err)
	}
	dest := filepath.Join(cacheDir, "G-Torrent", "bin", "ffmpeg.exe")

	if hashOK(dest, ffmpegSHA256) {
		return dest, nil
	}

	if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil {
		return "", fmt.Errorf("create bin dir: %w", err)
	}

	tmp := dest + ".tmp"
	if err := os.WriteFile(tmp, ffmpegBinary, 0o755); err != nil {
		return "", fmt.Errorf("write ffmpeg: %w", err)
	}
	if err := os.Rename(tmp, dest); err != nil {
		_ = os.Remove(tmp)
		return "", fmt.Errorf("install ffmpeg: %w", err)
	}
	return dest, nil
}

func hashOK(path, want string) bool {
	f, err := os.Open(path)
	if err != nil {
		return false
	}
	defer f.Close()

	h := sha256.New()
	if _, err := io.Copy(h, f); err != nil {
		return false
	}
	return hex.EncodeToString(h.Sum(nil)) == want
}

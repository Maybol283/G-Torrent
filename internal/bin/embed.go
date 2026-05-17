package bin

import _ "embed"

//go:embed payload/ffmpeg.exe
var ffmpegBinary []byte

const ffmpegSHA256 = "228d7a8556258de907fdb55f36850078ebc7680b84ec30d84ea02e99bec1d1eb"

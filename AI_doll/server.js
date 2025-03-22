const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`${PORT}번 포트에서 서버 대기 중`);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket 연결됨. 음성 데이터 수신 시작...");

  let audioBuffer = Buffer.alloc(0);

  ws.on("message", (chunk) => {
    audioBuffer = Buffer.concat([audioBuffer, chunk]);
    //console.log(`🎤 받은 오디오 데이터 누적 크기: ${audioBuffer.length} bytes`);

    // 약 3초 분량(16000샘플/초 * 2바이트 = 32,000 byte), 충분히 말한 뒤 처리
    if (audioBuffer.length >= 32000 * 3) {
      const pythonProcess = spawn("python", ["stt/stt.py"], { shell: true });

      pythonProcess.stdin.write(audioBuffer);
      pythonProcess.stdin.end();

      pythonProcess.stdout.on("data", (data) => {
        const result = data.toString().trim();
        if (result) {
          console.log("📝 STT 변환 결과:", result);
          ws.send(JSON.stringify({ transcript: result }));
        }
      });

      pythonProcess.stderr.on("data", (err) => {
        console.error("❌ Python 오류:", err.toString());
      });

      pythonProcess.on("close", () => {
        console.log("✅ STT 처리 완료, 버퍼 초기화");
        audioBuffer = Buffer.alloc(0);
      });
    }
  });

  ws.on("close", () => {
    console.log("❌ WebSocket 연결 종료됨.");
  });
});

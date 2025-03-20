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

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket 연결됨.");

  ws.on("message", (message) => {
    console.log("클라이언트로부터 오디오 데이터 수신");

    // Python STT 스크립트 실행 (윈도우에서는 shell: true 필요)
    const pythonProcess = spawn("python", ["stt.py"], { shell: true });

    // Python 프로세스로 데이터 전달
    pythonProcess.stdin.write(message);
    pythonProcess.stdin.end();

    // Python에서 변환된 텍스트 수신
    pythonProcess.stdout.on("data", (data) => {
      console.log("STT 변환 결과:", data.toString());
      ws.send(JSON.stringify({ transcript: data.toString().trim() }));
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python 오류:", data.toString());
      ws.send(JSON.stringify({ error: "STT 처리 중 오류 발생" }));
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python 프로세스 종료 (코드: ${code})`);
    });
  });

  ws.on("close", () => {
    console.log("WebSocket 연결 종료.");
  });
});

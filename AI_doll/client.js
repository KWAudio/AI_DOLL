const WebSocket = require("ws");
const mic = require("mic");

const ws = new WebSocket("ws://localhost:8000");

ws.onopen = () => {
  console.log("✅ 서버와 WebSocket 연결됨.");

  const micInstance = mic({
    rate: "16000",
    channels: "1",
    debug: false,
    exitOnSilence: 6
  });

  const micInputStream = micInstance.getAudioStream();

  micInputStream.on("data", function(data) {
    console.log("🎤 마이크 입력:", data.length, "bytes");
    ws.send(data);
  });

  micInstance.start();
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("📝 변환된 텍스트:", data.transcript);
};

ws.onerror = (error) => {
  console.error("❌ WebSocket 오류:", error);
};

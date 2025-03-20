const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8000");

ws.onopen = () => {
  console.log("✅ 서버와 WebSocket 연결됨.");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("📝 변환된 텍스트:", data.transcript);
};

ws.onerror = (error) => {
  console.error("WebSocket 오류:", error);
};

ws.onclose = () => {
  console.log("❌ WebSocket 연결 종료됨.");
};

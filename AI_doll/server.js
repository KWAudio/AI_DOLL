const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/stt', (req, res) => {
    const { text } = req.body;
    console.log('📥 받은 STT 결과:', text);
    res.status(200).send({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`🟢 STT 서버가 http://localhost:${PORT} 에서 실행 중`);
});

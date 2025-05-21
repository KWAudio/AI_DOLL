const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/stt', (req, res) => {
    const { text } = req.body;
    console.log('받은 STT 결과:', text);

    const pythonAnswer = spawn('python', ['answer_rp.py', text], {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let answer = '';

    pythonAnswer.stdout.on('data', (data) => {
        answer += data.toString('utf-8');
    });

    pythonAnswer.stderr.on('data', (data) => {
        console.error('응답 생성 오류:', data.toString());
    });

    pythonAnswer.on('close', (code) => {
        const finalAnswer = answer.trim();
        console.log('손자녀 응답:', finalAnswer);

        
        const pythonTTS = spawn('python', ['tts_model.py', finalAnswer], {
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
        });

        pythonTTS.stderr.on('data', (data) => {
            console.error('TTS 에러:', data.toString());
        });
    });

    res.status(200).send({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`STT 서버가 http://localhost:${PORT} 에서 실행 중`);
});

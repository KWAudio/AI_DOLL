import pyttsx3
import sys

# 텍스트 받기
if len(sys.argv) < 2:
    print("⚠️ 변환할 텍스트를 인자로 주세요.")
    sys.exit(1)

text = sys.argv[1]

# TTS 엔진 초기화
engine = pyttsx3.init()

# 목소리 설정 
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[0].id)  


engine.say(text)
engine.runAndWait()

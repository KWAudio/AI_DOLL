import sys
import speech_recognition as sr

# Recognizer 객체 생성
recognizer = sr.Recognizer()

def process_audio():
    try:
        # 표준 입력에서 오디오 데이터를 읽음 (Node.js에서 전달된 데이터)
        audio_data = sys.stdin.buffer.read()

        # AudioData 객체로 변환
        audio = sr.AudioData(audio_data, 16000, 2)

        # STT 변환 수행
        text = recognizer.recognize_google(audio, language="ko-KR")
        print(text)  # 변환된 텍스트를 stdout으로 출력 (Node.js가 읽음)

    except sr.UnknownValueError:
        print("음성을 인식할 수 없습니다.")
    except sr.RequestError as e:
        print(f"STT 오류: {e}")

if __name__ == "__main__":
    process_audio()

import sys
import speech_recognition as sr

recognizer = sr.Recognizer()

def process_audio():
    try:
        print("[INFO] STT 모듈 실행됨. 오디오 수신 대기 중...")

        audio_data = sys.stdin.buffer.read()
        print(f"[INFO] 오디오 데이터 수신 완료. 크기: {len(audio_data)} bytes")

        if len(audio_data) == 0:
            print("[WARNING] 오디오가 비어 있음")
            return

        # 오디오 객체 생성 (channels=1, sample_width=2)
        audio = sr.AudioData(audio_data, 16000, 2)

        print("[INFO] Google STT 요청 중...")
        text = recognizer.recognize_google(audio, language="ko-KR")
        print("[RESULT]", text)

    except sr.UnknownValueError:
        print("[ERROR] 음성을 인식할 수 없습니다.")
    except sr.RequestError as e:
        print(f"[ERROR] Google STT 요청 실패: {e}")
    except Exception as e:
        print(f"[ERROR] 기타 예외 발생: {e}")

if __name__ == "__main__":
    process_audio()

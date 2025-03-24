import speech_recognition as sr
import time
import requests

r = sr.Recognizer()

print("시작하려면 잠시 기다려 주세요. (서버에 전송, q로 종료)")

try:
    with sr.Microphone() as source:
        r.adjust_for_ambient_noise(source)
        print("준비 완료! 말씀하세요.")

        last_input_time = time.time()

        while True:
            if time.time() - last_input_time > 60:
                print("🕒 1분간 입력 없음으로 자동 종료합니다.")
                break

            try:
                audio = r.listen(source)
                text = r.recognize_google(audio, language="ko-KR")
                print("🎤 인식된 음성:", text)

                # 서버로 전송
                try:
                    res = requests.post("http://localhost:5000/stt", json={"text": text})
                    if res.status_code != 200:
                        print("⚠️ 서버 응답 오류:", res.text)
                except requests.exceptions.RequestException as e:
                    print("❌ 서버 연결 실패:", e)

                last_input_time = time.time()

            except sr.UnknownValueError:
                print("❓ 음성을 이해할 수 없습니다.")
            except sr.RequestError as e:
                print(f"API 요청 오류: {e}")

except KeyboardInterrupt:
    print("\n🛑 키보드 인터럽트로 종료되었습니다.")

import sys
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch


if len(sys.argv) < 2:
    print("입력이 필요합니다.")
    sys.exit(1)

user_input = sys.argv[1]

device = "cuda" if torch.cuda.is_available() else "cpu"

base_model_path = "./ko-gpt-trinity-1.2B-v0.5"
model = AutoModelForCausalLM.from_pretrained(base_model_path, torch_dtype=torch.float16).to(device)

lora_path = "./best_model"
model = PeftModel.from_pretrained(model, lora_path).to(device)

tokenizer = AutoTokenizer.from_pretrained(base_model_path)

system_prompt = (
    "너는 할머니에게 손자녀처럼 대답하는 AI야. 말투는 항상 따뜻하고 친근해야 해, 반드시 손자녀(8세) 입장을 유지해야 해.\n"
    "답변을해준 이후에는 다음 문장들을 예측해서 출력하지마\n\n"
    "항상 질문에 맞는 대답을 해줘.\n"
    "상황에 맞게 손자녀가 질문도 해주어 대화가 이어나갈 수 있게 해줘.\n"
)

final_prompt = system_prompt + f"할머니: {user_input}\n손자녀:"

inputs = tokenizer(final_prompt, return_tensors="pt").to(device)

with torch.no_grad():
    output = model.generate(
        **inputs,
        max_new_tokens=20,
        temperature=0.8,
        top_p=0.9,
        do_sample=True,
        pad_token_id=tokenizer.eos_token_id
    )

response = tokenizer.decode(output[0], skip_special_tokens=True)
if "손자녀:" in response:
    answer = response.split("손자녀:")[1].strip()
else:
    answer = response.strip()

print(answer)

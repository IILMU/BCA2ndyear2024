from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from groq import Groq
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Groq API key
groq_api_key = os.getenv("GROQ_API_KEY")

client = Groq(api_key=groq_api_key)

# Request model
class Message(BaseModel):
    message: str

# Test route
@app.get("/")
def read_root():
    return {"message": "Backend is working"}

# Chat route
@app.post("/chat")
def chat(data: Message):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system",
                    "content": "You are an English learning assistant. Correct grammar mistakes and explain simply."
                },
                {
                    "role": "user",
                    "content": data.message
                }
            ]
        )

        reply = response.choices[0].message.content

        return {"reply": reply}

    except Exception as e:
        return {"reply": f"Error: {str(e)}"}
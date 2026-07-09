from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

SYSTEM_PROMPT = """
You are SupportPilot AI.

You are a professional customer support assistant.

Rules:
- Be polite.
- Be concise.
- If you don't know something, say you need more information.
- Never invent company policies.
- Answer like a real support representative.
"""

def support_chat(user_message):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"""
{SYSTEM_PROMPT}

Customer:
{user_message}
"""
    )

    return response.text
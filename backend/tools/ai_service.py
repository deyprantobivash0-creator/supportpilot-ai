from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-2.5-flash"


def ask_gemini(prompt):

    print("🤖 AI request received")

    try:

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return response.text.strip()

    except Exception as e:

        print(f"Gemini Error: {e}")

        return "AI unavailable."

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

def summarize_ticket(message):

    prompt = f"""
Summarize the following customer support ticket in one short paragraph.

Only return the summary.

Ticket:

{message}
"""

    return ask_gemini(prompt)


def analyze_sentiment(message):

    prompt = f"""
Analyze the customer's sentiment.

Return ONLY ONE WORD from this list:

Positive
Neutral
Negative
Urgent

Ticket:

{message}
"""

    return ask_gemini(prompt)


def suggest_tags(message):

    prompt = f"""
Suggest 3 short support tags.

Return only comma separated values.

Example:

Delay, Customs, Tracking

Ticket:

{message}
"""

    return ask_gemini(prompt)


def generate_reply(message):

    prompt = f"""
You are a professional customer support representative.

Write a polite reply to this customer.

Ticket:

{message}
"""

    return ask_gemini(prompt)

def estimate_confidence(message):

    prompt = f"""
You are an AI confidence estimator.

Rate how confident you are in understanding this customer ticket.

Return ONLY ONE NUMBER between 70 and 99.

Ticket:

{message}
"""
    # Get model output and try to parse an integer score
    resp = ask_gemini(prompt)
    try:
        score = int(resp.strip())
    except Exception:
        score = 90

    score = max(70, min(score, 99))

    return score

def predict_department(message):

    prompt = f"""
Choose the most appropriate department.

Return ONLY ONE WORD.

Choices:

Sales

Support

Operations

Finance

Customs

Ticket:

{message}
"""
    return ask_gemini(prompt)


def predict_priority(message):

    prompt = f"""
Predict ticket priority.

Return ONLY ONE WORD.

Choices:

Low

Medium

High

Critical

Ticket:

{message}
"""
    return ask_gemini(prompt)

def estimate_resolution_time(message):

    prompt = f"""
Estimate how long this customer issue will take to resolve.

Return ONLY ONE of these values:

30 Minutes
1 Hour
2 Hours
4 Hours
1 Day
2 Days
3 Days

Ticket:

{message}
"""

    return ask_gemini(prompt)


def detect_escalation(message):

    prompt = f"""
Should this support ticket be escalated?

Return ONLY:

Yes

or

No

Ticket:

{message}
"""

    return ask_gemini(prompt)


def customer_health_score(message):

    prompt = f"""
Based on this customer message, estimate the customer health.

Return ONLY a number between 0 and 100.

Ticket:

{message}
"""

    result = ask_gemini(prompt)

    try:
        score = int(result)
    except:
        score = 80

    score = max(0, min(score, 100))

    return score

    import json

def analyze_customer(message):

    prompt = f"""
You are an enterprise AI support assistant.

Analyze the following customer ticket.

Return ONLY valid JSON.

Do not use markdown.
Do not use ```json.
Do not add explanations.

Return exactly this schema:

{{
    "summary":"...",
    "sentiment":"Positive|Neutral|Negative|Urgent",
    "tags":"tag1, tag2, tag3",
    "reply":"Professional customer reply",
    "confidence":90,
    "department":"Support",
    "priority":"Medium",
    "resolution":"2 Hours",
    "escalation":"No",
    "health":85
}}

Customer Ticket:

{message}
"""

    result = ask_gemini(prompt)

    print("\n========== RAW GEMINI RESPONSE ==========")
    print(result)
    print("=========================================\n")

    result = result.strip()

    if "```json" in result:
        result = result.replace("```json", "")

    result = result.replace("```", "").strip()

    start = result.find("{")
    end = result.rfind("}")

    if start != -1 and end != -1:
        result = result[start:end+1]

    try:
        return json.loads(result)

    except Exception as e:

        print("JSON Parse Error:", e)

        return {
            "summary": "AI parsing failed.",
            "sentiment": "Unknown",
            "tags": "",
            "reply": "We're reviewing your request and will get back to you shortly.",
            "confidence": 80,
            "department": "Support",
            "priority": "Medium",
            "resolution": "Unknown",
            "escalation": "No",
            "health": 80
        }


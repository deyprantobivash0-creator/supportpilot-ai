# 🏗️ SupportPilot AI System Architecture

```text
                         ┌──────────────────────────┐
                         │        User Browser      │
                         │ (Chrome / Edge / Firefox)│
                         └─────────────┬────────────┘
                                       │
                          HTTP Requests │
                                       ▼
                    ┌─────────────────────────────┐
                    │      Flask Web Server       │
                    │          app.py             │
                    └─────────────┬───────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
      Customer APIs         Ticket APIs          AI APIs
             │                    │                    │
             └──────────────┬─────┴──────────────┬─────┘
                            │                    │
                            ▼                    ▼
                 backend/tools/          Google Gemini API
                            │
                            ▼
                 CRM + AI Business Logic
                            │
                            ▼
                  JSON Local Database
          ┌──────────────┬──────────────┐
          │              │              │
          ▼              ▼              ▼
   customers.json   tickets.json   notes.json
                            │
                            ▼
                     JSON Response
                            │
                            ▼
                   JavaScript Frontend
                     static/script.js
                            │
                            ▼
                     HTML + CSS UI
                        templates/
                        static/css/
```

## Components

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript

Responsible for:

* Dashboard
* Customer Profile
* Ticket Management
* Analytics
* AI Copilot Interface

---

### Backend

Flask application exposing REST API endpoints.

Responsibilities:

* Customer CRUD
* Ticket Management
* Notes & Tags
* Analytics
* AI Integration

---

### AI Layer

Google Gemini API

Provides:

* Ticket Summary
* Sentiment Analysis
* Smart Tags
* Suggested Department
* Priority Prediction
* Resolution Estimate
* Customer Health
* AI Reply Generation

---

### Data Layer

Local JSON database

* customers.json
* tickets.json
* notes.json

No external database required for v1.0.

---

## Data Flow

User

↓

Frontend (HTML/CSS/JavaScript)

↓

Flask API

↓

Business Logic

↓

Gemini AI + JSON Database

↓

JSON Response

↓

Frontend Rendering

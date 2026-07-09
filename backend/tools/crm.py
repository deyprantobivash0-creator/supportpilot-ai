import json
import os
from datetime import datetime

CRM_FILE = "data/customers.json"


def initialize_crm():
    dirpath = os.path.dirname(CRM_FILE)
    if dirpath and not os.path.exists(dirpath):
        os.makedirs(dirpath, exist_ok=True)
    if not os.path.exists(CRM_FILE):
        with open(CRM_FILE, "w", encoding="utf-8") as file:
            json.dump([], file)


def save_customer(customer_name, email, company, priority, message, reply=None):
    """Save a new customer ticket and return the ticket dict."""
    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        customers = json.load(file)

    ticket_id = len(customers) + 1
    ticket_number = f"SP-{datetime.now().strftime('%Y%m%d')}-{ticket_id:04d}"

    ticket = {
        "ticket_id": ticket_id,
        "ticket_number": ticket_number,
        "customer_name": customer_name,
        "email": email,
        "company": company,
        "question": message,
        "ai_reply": reply,
        "status": "Open",
        "priority": priority,
        "assigned_to": "AI",
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    customers.append(ticket)

    with open(CRM_FILE, "w", encoding="utf-8") as file:
        json.dump(customers, file, indent=4)

    return ticket


def get_dashboard():
    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        customers = json.load(file)

    total = len(customers)

    open_count = sum(1 for c in customers if c.get("status") == "Open")

    closed_count = sum(1 for c in customers if c.get("status") == "Closed")

    high_priority = sum(1 for c in customers if c.get("priority") == "High")

    recent = customers[::-1][:10]

    return {
        "total": total,
        "open": open_count,
        "closed": closed_count,
        "high": high_priority,
        "recent": recent,
    }


def update_ticket(ticket_id, status):
    """Update ticket status by ticket_id. Returns True if updated, False if not found."""
    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        customers = json.load(file)

    found = False
    for ticket in customers:
        try:
            if int(ticket.get("ticket_id")) == int(ticket_id):
                ticket["status"] = status
                found = True
                break
        except (TypeError, ValueError):
            continue

    if found:
        with open(CRM_FILE, "w", encoding="utf-8") as file:
            json.dump(customers, file, indent=4)

    return found
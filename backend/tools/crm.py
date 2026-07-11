import json
import os
from datetime import datetime
from backend.customer import get_or_create_customer

# -----------------------------
# Ticket Database
# -----------------------------
CRM_FILE = "data/tickets.json"


# -----------------------------
# Initialize Ticket Database
# -----------------------------
def initialize_crm():

    directory = os.path.dirname(CRM_FILE)

    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

    if not os.path.exists(CRM_FILE):

        with open(CRM_FILE, "w", encoding="utf-8") as file:
            json.dump([], file)


# -----------------------------
# Save Ticket
# -----------------------------
def save_customer(customer_name, email, company, priority, message, reply=None):

    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        tickets = json.load(file)

    # Create customer if necessary
    get_or_create_customer(
        customer_name,
        email,
        company
    )

    ticket_id = len(tickets) + 1

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

        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    }

    tickets.append(ticket)

    with open(CRM_FILE, "w", encoding="utf-8") as file:
        json.dump(tickets, file, indent=4)

    return ticket


# -----------------------------
# Dashboard Statistics
# -----------------------------
def get_dashboard():

    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        tickets = json.load(file)

    total = len(tickets)

    open_count = sum(
        1 for t in tickets
        if t["status"] == "Open"
    )

    closed_count = sum(
        1 for t in tickets
        if t["status"] == "Closed"
    )

    high_priority = sum(
        1 for t in tickets
        if t["priority"] == "High"
    )

    recent = tickets[::-1][:10]

    return {

        "total": total,

        "open": open_count,

        "closed": closed_count,

        "high": high_priority,

        "recent": recent

    }


# -----------------------------
# Update Ticket Status
# -----------------------------
def update_ticket(ticket_id, status):

    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        tickets = json.load(file)

    found = False

    for ticket in tickets:

        if ticket["ticket_id"] == int(ticket_id):

            ticket["status"] = status

            found = True

            break

    if found:

        with open(CRM_FILE, "w", encoding="utf-8") as file:
            json.dump(tickets, file, indent=4)

    return found


# -----------------------------
# Get All Tickets
# -----------------------------
def get_all_tickets():

    initialize_crm()

    with open(CRM_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


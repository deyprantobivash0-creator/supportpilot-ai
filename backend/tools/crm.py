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

def get_dashboard_stats():

    tickets = get_all_tickets()

    total_tickets = len(tickets)

    open_tickets = sum(
        1 for ticket in tickets
        if ticket.get("status", "").lower() == "open"
    )

    closed_tickets = sum(
        1 for ticket in tickets
        if ticket.get("status", "").lower() == "closed"
    )

    high_priority = sum(
        1 for ticket in tickets
        if ticket.get("priority", "").lower() in ["high", "critical"]
    )

    customer_emails = set()

    companies = set()

    for ticket in tickets:

        if ticket.get("email"):
            customer_emails.add(ticket["email"].lower())

        if ticket.get("company"):
            companies.add(ticket["company"])

    return {

        "total_tickets": total_tickets,

        "open_tickets": open_tickets,

        "closed_tickets": closed_tickets,

        "high_priority": high_priority,

        "total_customers": len(customer_emails),

        "total_companies": len(companies)

    }


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


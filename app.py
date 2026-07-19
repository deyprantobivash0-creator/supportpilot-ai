from flask import Flask, render_template, request, jsonify
from backend.tools.ai_service import (
    support_chat,
    analyze_customer
)

from backend.customer import (
    get_customer,
    get_all_customers,
    update_customer_notes,
    add_customer_tag
)
from backend.tools.crm import (
    save_customer,
    get_all_tickets,
    get_dashboard,
    get_dashboard_stats,
    update_ticket
)
app = Flask(
    __name__,
    template_folder="frontend/templates",
    static_folder="static"
)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.json

    customer_name = data["customer_name"]
    email = data["email"]
    company = data["company"]
    priority = data["priority"]
    message = data["message"]
  
    reply = support_chat(message)

    save_customer(

    customer_name,

    email,

    company,

    priority,

    message,

    reply

)

    return jsonify({

        "reply":reply

    })

@app.route("/dashboard")
def dashboard():

    data = get_dashboard()

    return jsonify(data)

@app.route("/update_ticket", methods=["POST"])
def update():

    data = request.json

    ticket_id = int(data["ticket_id"])

    status = data["status"]

    update_ticket(
        ticket_id,
        status
    )

    return jsonify({
        "message":"updated"
    })


@app.route("/customers", methods=["GET"])
def customers():

    return jsonify(get_all_customers())
@app.route("/customer/<int:customer_id>", methods=["GET"])
def customer_profile(customer_id):

    customer = get_customer(customer_id)

    if customer is None:

        return jsonify({"error": "Customer not found"}), 404

    return jsonify(customer)

@app.route("/customer_tickets/<path:email>", methods=["GET"])
def customer_tickets(email):

    tickets = get_all_tickets()

    customer_tickets = []

    for ticket in tickets:

        if ticket.get("email", "").lower() == email.lower():

            customer_tickets.append(ticket)

    return jsonify(customer_tickets)

@app.route("/customer/<int:customer_id>/notes", methods=["POST"])
def save_customer_notes(customer_id):

    data = request.get_json()

    notes = data.get("notes", "")

    success = update_customer_notes(customer_id, notes)

    if success:

        return jsonify({"success": True})

    return jsonify({"success": False}), 404


@app.route("/customer/<int:customer_id>/tags", methods=["POST"])
def save_customer_tag(customer_id):

    data = request.get_json()

    tag = data.get("tag", "")

    success = add_customer_tag(customer_id, tag)

    if success:

        return jsonify({"success": True})

    return jsonify({"success": False}), 404

@app.route("/dashboard_stats", methods=["GET"])
def dashboard_stats():

    stats = get_dashboard_stats()

    return jsonify(stats)

@app.route("/ai_insights", methods=["POST"])
def ai_insights():

    data = request.json

    message = data.get("message", "")

    result = analyze_customer(message)

    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True)
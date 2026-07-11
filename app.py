from flask import Flask, render_template, request, jsonify
from backend.tools.ai_service import support_chat
from backend.tools.crm import save_customer
from backend.customer import get_all_customers
from backend.customer import get_customer
from backend.tools.crm import get_all_tickets
from backend.tools.crm import (
    save_customer,
    get_dashboard,
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

@app.route("/customers")

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



if __name__ == "__main__":
    app.run(debug=True)
import json
import os
from datetime import datetime

CUSTOMER_DB = "data/customers.json"


def load_customers():
    if not os.path.exists(CUSTOMER_DB):
        return []

    with open(CUSTOMER_DB, "r") as f:
        return json.load(f)


def save_customers(customers):
    with open(CUSTOMER_DB, "w") as f:
        json.dump(customers, f, indent=4)


def get_or_create_customer(customer_name, email, company):

    customers = load_customers()

    for customer in customers:

        if customer["email"].lower() == email.lower():

            customer["total_tickets"] += 1
            customer["last_contact"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            save_customers(customers)

            return customer

    customer_id = len(customers) + 1

    new_customer = {

        "customer_id": customer_id,
        "customer_name": customer_name,
        "email": email,
        "company": company,
        "total_tickets": 1,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "last_contact": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "notes": "",
        "tags": []

    }

    customers.append(new_customer)

    save_customers(customers)

    return new_customer


def get_all_customers():

    return load_customers()


def get_customer(customer_id):
    """
    Return a single customer by customer_id.
    """

    customers = load_customers()

    for customer in customers:

        if customer["customer_id"] == int(customer_id):

            return customer

    return None


def search_customers(keyword):
    """
    Search customers by name, email or company.
    """

    keyword = keyword.lower()

    customers = load_customers()

    results = []

    for customer in customers:

        if (
            keyword in customer["customer_name"].lower()
            or keyword in customer["email"].lower()
            or keyword in customer["company"].lower()
        ):

            results.append(customer)

    return results


def update_customer_notes(customer_id, notes):

    customers = load_customers()

    for customer in customers:

        if customer["customer_id"] == int(customer_id):

            customer["notes"] = notes

            save_customers(customers)

            return True

    return False

def add_customer_tag(customer_id, tag):

    customers = load_customers()

    tag = tag.strip()

    if tag == "":
        return False

    for customer in customers:

        if customer["customer_id"] == int(customer_id):

            if tag not in customer["tags"]:

                customer["tags"].append(tag)

                save_customers(customers)

            return True

    return False




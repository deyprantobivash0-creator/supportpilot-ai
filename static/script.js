// =========================
// Send Customer Message
// =========================

async function sendMessage() {
	const customer_name = document.getElementById("customer_name").value;
	const email = document.getElementById("email").value;
	const company = document.getElementById("company").value;
	const priority = document.getElementById("priority").value;
	const message = document.getElementById("message").value;

	const response = await fetch("/chat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ customer_name, email, company, priority, message })
	});

	const data = await response.json();

	// Ticket created successfully
	alert("Support ticket created successfully!");

	loadDashboard();

}

// =========================
// Load CRM Dashboard
// =========================

async function loadDashboard() {

    const response = await fetch("/dashboard");
    const data = await response.json();

    const search = document
.getElementById("searchTicket")
?.value
.toLowerCase() || "";

const status = document
.getElementById("statusFilter")
?.value || "All Status";

const priority = document
.getElementById("priorityFilter")
?.value || "All Priority";

    let html = `

    <div class="dashboard">

        <div class="dashboard-header">

            <div class="dashboard-title">
                <h1>SupportPilot AI</h1>
                <p>Customer Experience Dashboard</p>
            </div>

            <div class="dashboard-date">
                <div>${new Date().toLocaleDateString()}</div>
            </div>

        </div>

        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-number">${data.total}</div>
                <div class="stat-title">Total Tickets</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🟢</div>
                <div class="stat-number">${data.open}</div>
                <div class="stat-title">Open Tickets</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🟡</div>
                <div class="stat-number">${data.closed}</div>
                <div class="stat-title">Closed Tickets</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🔴</div>
                <div class="stat-number">${data.high}</div>
                <div class="stat-title">High Priority</div>
            </div>

        </div>

        <h2>Recent Tickets</h2>

        <div class="ticket-list">
    `;

    data.recent
.filter(ticket=>{

    const matchesSearch=

        ticket.customer_name.toLowerCase().includes(search)

        ||

        ticket.company.toLowerCase().includes(search)

        ||

        ticket.question.toLowerCase().includes(search);

    const matchesStatus=

        status==="All Status"

        ||

        ticket.status===status;

    const matchesPriority=

        priority==="All Priority"

        ||

        ticket.priority===priority;

    return matchesSearch

        &&

        matchesStatus

        &&

        matchesPriority;

})

.forEach(ticket=>{

        html += `

        <div class="ticket-card">

            <div class="ticket-header">

                <div class="ticket-number">
                    ${ticket.ticket_number}
                </div>

                <div class="ticket-date">
                    ${ticket.created_at}
                </div>

            </div>

            <div class="ticket-grid">

                <div class="ticket-section">
                    <span class="ticket-label">👤 Customer</span>
                    ${ticket.customer_name}
                </div>

                <div class="ticket-section">
                    <span class="ticket-label">🏢 Company</span>
                    ${ticket.company}
                </div>

                <div class="ticket-section">
                    <span class="ticket-label">📧 Email</span>
                    ${ticket.email}
                </div>

                <div class="ticket-section">
                    <span class="ticket-label">🤖 Assigned</span>
                    ${ticket.assigned_to}
                </div>

                <div class="ticket-section">
                    <span class="ticket-label">📌 Priority</span>

                    <span class="badge priority-${ticket.priority.toLowerCase()}">
                        ${ticket.priority}
                    </span>

                </div>

                <div class="ticket-section">
                    <span class="ticket-label">📍 Status</span>

                    <span class="badge status-${ticket.status.toLowerCase().replace(/\s+/g,"-")}">
                        ${ticket.status}
                    </span>

                </div>

            </div>

            <div class="ticket-issue">

                <div class="ticket-issue-title">

                    ❓ Customer Issue

                </div>

                <div class="ticket-issue-text">

                    ${ticket.question}

                </div>

            </div>

            <div class="ticket-actions">

                <button onclick="changeStatus(${ticket.ticket_id},'Open')">

                    Open

                </button>

                <button onclick="changeStatus(${ticket.ticket_id},'In Progress')">

                    In Progress

                </button>

                <button onclick="changeStatus(${ticket.ticket_id},'Closed')">

                    Closed

                </button>

            </div>

        </div>

        `;

    });

    html += `

        </div>

    </div>

    `;

    document.getElementById("dashboard").innerHTML = html;

}


// =========================
// Change Ticket Status
// =========================

async function changeStatus(ticket_id, status) {

    await fetch("/update_ticket", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            ticket_id,
            status

        })

    });

    loadDashboard();

}


async function loadCustomerProfile(customerId) {

    const response = await fetch(`/customer/${customerId}`);
    const customer = await response.json();
     const ticketResponse = await fetch(
    `/customer_tickets/${encodeURIComponent(customer.email)}`
   );

const tickets = await ticketResponse.json();


    document.getElementById("dashboard").innerHTML = `

    <div class="profile-page">

        <button class="secondary-btn"
                onclick="loadCustomers()">
            ← Back to Customers
        </button>

        <div class="profile-header">

            <div class="profile-avatar">
                👤
            </div>

            <div>

                <h2>${customer.customer_name}</h2>

                <p>${customer.company}</p>

                <span class="status-badge open">
                    Premium Customer
                </span>

            </div>

        </div>

        <div class="profile-section">

            <h3>📊 Customer Overview</h3>

            <div class="stats-grid">

                <div class="stat-card">

                    <h2>${customer.total_tickets}</h2>

                    <p>Total Tickets</p>

                </div>

                <div class="stat-card">

                    <h2>${customer.last_contact}</h2>

                    <p>Last Contact</p>

                </div>

            </div>

        </div>

        <div class="profile-section">

            <h3>📞 Contact Information</h3>

            <p><strong>Email:</strong> ${customer.email}</p>

            <p><strong>Company:</strong> ${customer.company}</p>

        </div>

        <div class="profile-section">

            <h3>📝 Internal Notes</h3>

            <p>${customer.notes || "No notes yet."}</p>

        </div>

    </div>

    `;
}



async function loadCustomers() {

    const response = await fetch("/customers");

    const customers = await response.json();

    let html = "";

    customers.forEach(customer => {

        html += `
        <div class="ticket-card">

            <h3>${customer.customer_name}</h3>

            <p><strong>Company:</strong> ${customer.company}</p>

            <p><strong>Email:</strong> ${customer.email}</p>

            <p><strong>Total Tickets:</strong> ${customer.total_tickets}</p>

            <p><strong>Last Contact:</strong> ${customer.last_contact}</p>

           
         <button
         class="primary-btn"onclick="loadCustomerProfile(${customer.customer_id})">
         Open Profile
         
         </button>



        </div>
        `;
    });

    document.getElementById("dashboard").innerHTML = html;
}


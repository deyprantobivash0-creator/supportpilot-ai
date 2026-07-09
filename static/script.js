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

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            customer_name,
            email,
            company,
            priority,
            message

        })

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
let html = `

<div class="dashboard">

<div class="stats-grid">

<div class="stat-card">

<div style="font-size:32px;">📋</div>

<div class="stat-number">
${data.total}
</div>

<div class="stat-title">
Total Tickets
</div>

</div>

<div class="stat-card">

<div style="font-size:32px;">🟢</div>

<div class="stat-number">
${data.open}
</div>

<div class="stat-title">
Open Tickets
</div>

</div>

<div class="stat-card">

<div style="font-size:32px;">🟡</div>

<div class="stat-number">
${data.closed}
</div>

<div class="stat-title">
Closed Tickets
</div>

</div>

<div class="stat-card">

<div style="font-size:32px;">🔴</div>

<div class="stat-number">
${data.high}
</div>

<div class="stat-title">
High Priority
</div>

</div>

</div>

<h2 style="margin-bottom:20px;">

Recent Tickets

</h2>

<div class="ticket-list">

`;

    data.recent.forEach(ticket => {
    html += `

<div class="ticket-card">

    <div class="ticket-header">

        <div class="ticket-number">

            ${ticket.ticket_number}

        </div>

        <div>

            ${ticket.created_at}

        </div>

    </div>

    <div class="ticket-section">

        <span class="ticket-label">👤 Customer:</span>

        ${ticket.customer_name}

    </div>

    <div class="ticket-section">

        <span class="ticket-label">🏢 Company:</span>

        ${ticket.company}

    </div>

    <div class="ticket-section">

        <span class="ticket-label">📧 Email:</span>

        ${ticket.email}

    </div>

    <div class="ticket-section">

        <span class="ticket-label">❓ Issue:</span>

        ${ticket.question}

    </div>

    <div class="ticket-section">

        <span class="ticket-label">📌 Priority:</span>

        ${ticket.priority}

    </div>

    <div class="ticket-section">

        <span class="ticket-label">📍 Status:</span>

        ${ticket.status}

    </div>

    <div class="ticket-actions">

        <button onclick="changeStatus(${ticket.ticket_id}, 'Open')">

            Open

        </button>

        <button onclick="changeStatus(${ticket.ticket_id}, 'In Progress')">

            In Progress

        </button>

        <button onclick="changeStatus(${ticket.ticket_id}, 'Closed')">

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
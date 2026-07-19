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

  const statsResponse = await fetch("/dashboard_stats");

const stats = await statsResponse.json();

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
                <div class="dashboard-hero">

    <div>

        <h1>Good Evening, Pranto 👋</h1>

        <p>Customer Experience Center</p>

    </div>

    <div class="hero-right">

        <div class="hero-date">

            ${new Date().toLocaleDateString()}

        </div>

    </div>

</div>
            </div>

            <div class="dashboard-date">
                <div>${new Date().toLocaleDateString()}</div>
            </div>

        </div>

        <h2 class="section-title">

📊 Business Overview

</h2>

<div class="quick-actions">

    <button class="action-btn primary-action"
        onclick="window.scrollTo({top:0,behavior:'smooth'})">

        ➕ New Ticket

    </button>

    <button class="action-btn"

        onclick="loadCustomers()">

        👥 Customers

    </button>

    <button class="action-btn"

        onclick="loadDashboard()">

        🔄 Refresh

    </button>

</div>

<div class="stats-grid">

            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <div class="stat-number">${stats.total_tickets}</div>
                <div class="stat-title">Total Tickets</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🟢</div>
                <div class="stat-number">${stats.open_tickets}</div>
                <div class="stat-title">Open Tickets</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🟡</div>
                <div class="stat-number">${stats.closed_tickets}</div>
                <div class="stat-title">Closed Tickets</div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">🔴</div>
                <div class="stat-number">${stats.high_priority}</div>
                <div class="stat-title">High Priority</div>
            </div>

        </div>


        <div class="stat-card">
    <div class="stat-icon">👥</div>
    <div class="stat-number">${stats.total_customers}</div>
    <div class="stat-title">Customers</div>
</div>

<div class="stat-card">
    <div class="stat-icon">🏢</div>
    <div class="stat-number">${stats.total_companies}</div>
    <div class="stat-title">Companies</div>
</div>

</div> 
        <h2 class="section-title">

🎫 Recent Support Tickets

</h2>

    

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

    <div class="ticket-accent"></div>

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

    <h3>🤖 AI Copilot</h3>

    <div id="ai-panel">

        <p>Loading AI insights...</p>

    </div>

 </div>

        <div class="profile-section">

    <h3>🏷 Customer Tags</h3>

    <div class="tag-container">

        ${
            !customer.tags || customer.tags.length === 0

            ? "<p>No tags yet.</p>"

            : customer.tags.map(tag => `

                <span class="customer-tag">

                    ${tag}

                </span>

            `).join("")
        }

    </div>

    <br>

    <input
        id="newTag"
        class="tag-input"
        placeholder="Add new tag..."
    >

    <button
        class="primary-btn"
        onclick="addCustomerTag(${customer.customer_id})">

        + Add Tag

    </button>

</div>

        <div class="profile-section">

 <h3>🎫 Recent Tickets</h3>

      ${
        tickets.length === 0
        ?

        "<p>No tickets found.</p>"

        :

        tickets.map(ticket => `

            <div class="ticket-card">

                <h4>${ticket.ticket_number}</h4>

                <p>${ticket.question}</p>

                <p>

                    <strong>Status:</strong>

                    ${ticket.status}

                </p>

                <p>

                    <strong>Priority:</strong>

                    ${ticket.priority}

                </p>

            </div>

        `).join("")
    }

</div>



       <h3>📝 Internal Notes</h3>

 <textarea
 id="customerNotes"
 class="notes-box"
 placeholder="Write internal notes here..."
 rows="8"
 >${customer.notes || ""}</textarea>

 <br><br>

 <button
 class="primary-btn"
 onclick="saveCustomerNotes(${customer.customer_id})">

 💾 Save Notes

 </button>
 

        </div>

    </div>

    `;
    loadAIInsights(

    tickets.length > 0

    ? tickets[0].question

    : "Customer profile loaded."

);
}

async function saveCustomerNotes(customerId){


const notes = document.getElementById("customerNotes").value;

const response = await fetch(`/customer/${customerId}/notes`,{

    method:"POST",

    headers:{
        "Content-Type":"application/json"
    },

    body:JSON.stringify({

        notes:notes

    })

});

const result = await response.json();

if(result.success){

    alert("✅ Notes saved successfully.");

}else{

    alert("❌ Failed to save notes.");

}


}

async function addCustomerTag(customerId){

    const input = document.getElementById("newTag");

    const tag = input.value.trim();

    if(tag === ""){

        alert("Please enter a tag.");

        return;

    }

    const response = await fetch(`/customer/${customerId}/tags`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            tag: tag
        })

    });

    const result = await response.json();

    if(result.success){

        input.value = "";

        loadCustomerProfile(customerId);

    }else{

        alert("Unable to save tag.");

    }

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

async function loadAIInsights(message){

    const panel=document.getElementById("ai-panel");

    if(!panel) return;

    panel.innerHTML="<p>🤖 AI is analyzing...</p>";

    try{

        const response=await fetch("/ai_insights",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:message

            })

        });

        if (!response.ok) {
    throw new Error("HTTP " + response.status);
}
        const data=await response.json();

       panel.innerHTML = `

<div class="ai-section">

    <h3>📝 AI Summary</h3>

    <p>${data.summary}</p>

</div>

<div class="ai-section">

    <h3>🙂 Sentiment</h3>

    <p>${data.sentiment}</p>

</div>

<div class="ai-section">

    <h3>🏷 Suggested Tags</h3>

    <p>${data.tags}</p>

</div>

<div class="ai-section">

    <h3>🎯 Confidence</h3>

    <p>${data.confidence}%</p>

</div>

<div class="ai-section">

    <h3>🏢 Suggested Department</h3>

    <p>${data.department}</p>

</div>

<div class="ai-section">

    <h3>🚨 Priority</h3>

    <p>${data.priority}</p>

</div>

<div class="ai-section">

    <h3>⏱ Resolution Estimate</h3>

    <p>${data.resolution}</p>

</div>

<div class="ai-section">

    <h3>⚠ Escalation</h3>

    <p>${data.escalation}</p>

</div>

<div class="ai-section">

    <h3>❤️ Customer Health</h3>

    <p>${data.health}/100</p>

</div>

<div class="ai-section">

    <h3>✉ Suggested Reply</h3>

    <textarea
        class="notes-box"
        rows="8"
        readonly
    >${data.reply}</textarea>

    <br><br>
<button
    class="primary-btn"
    id="copyReplyBtn">

    📋 Copy Reply

</button>



</div>

`;
document
    .getElementById("copyReplyBtn")
    .addEventListener("click", () => {

        navigator.clipboard.writeText(data.reply);

    });
    }

    catch (error) {

    console.error("AI Copilot Error:", error);

    panel.innerHTML = `
        <div class="profile-card">
            <h3>🤖 AI Copilot</h3>
            <p>❌ AI Error</p>
            <pre style="white-space:pre-wrap;color:red;">${error}</pre>
        </div>
    `;

}

}
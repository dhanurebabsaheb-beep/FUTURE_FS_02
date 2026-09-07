let leads = [];


// LOGIN

function login() {

    let email = document.getElementById("loginEmail").value;

    let password = document.getElementById("loginPassword").value;


    if (email === "admin@gmail.com" && password === "1234") {

        document.getElementById("login").style.display = "none";

        document.getElementById("dashboard").style.display = "block";

        getLeads();

    } else {

        alert("Wrong email or password");

    }

}


// LOGOUT

function logout() {

    document.getElementById("dashboard").style.display = "none";

    document.getElementById("login").style.display = "block";

}


// SHOW FORM

function showForm() {

    document.getElementById("form").style.display = "block";

}


// HIDE FORM

function hideForm() {

    document.getElementById("form").style.display = "none";

}


// ADD LEAD

async function addLead() {
    // alert("button working");

    let lead = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        source: document.getElementById("source").value,
        status: document.getElementById("status").value,
        follow_up: document.getElementById("follow_up").value,
        notes: document.getElementById("notes").value
    };

    // console.log(lead);

    if (lead.name === "" || lead.email === "") {
        alert("Please enter name and email");
        return;
    }

    try {
        console.log("sending lead to backend");
        let response = await fetch("http://localhost:5000/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });

        console.log("response recived");
        console.log(response);

        let data = await response.json();

        if (response.ok) {
            alert("Lead added successfully");
            clearForm();
            hideForm();
            getLeads();
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
        alert("Backend server is not running");
    }
}


// GET LEADS

async function getLeads() {

    try {

        let response = await fetch(
            "http://localhost:5000/api/leads"
        );

        leads = await response.json();

        showLeads();

        updateCards();

    } catch (error) {

        console.log(error);

    }

}


// SHOW LEADS

function showLeads() {

    let table = document.getElementById("leadList");

    table.innerHTML = "";


    leads.forEach(function(lead) {

        table.innerHTML += `

            <tr>

                <td>${lead.name}</td>

                <td>${lead.email}</td>

                <td>${lead.source}</td>

                <td>
                    <select onchange="updateStatus(${lead.id}, this.value)">
                        <option value="New" ${lead.status === "New" ? "selected" : ""}>New</option>
                        <option value="Contacted" ${lead.status === "Contacted" ? "selected" : ""}>Contacted</option>
                        <option value="Converted" ${lead.status === "Converted" ? "selected" : ""}>Converted</option>
                    </select>
                </td>

                    <button onclick="deleteLead(${lead.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });

}


// UPDATE CARDS

function updateCards() {

    let total = leads.length;

    let newLeads = leads.filter(
        lead => lead.status === "New"
    ).length;

    let contacted = leads.filter(
        lead => lead.status === "Contacted"
    ).length;

    let converted = leads.filter(
        lead => lead.status === "Converted"
    ).length;


    document.getElementById("total").innerText = total;

    document.getElementById("new").innerText = newLeads;

    document.getElementById("contacted").innerText = contacted;

    document.getElementById("converted").innerText = converted;

}

// UPDATE STATUS

async function updateStatus(id, status) {

    try {

        let response = await fetch(
            "http://localhost:5000/api/leads/" + id,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        if (response.ok) {
            alert("Status updated successfully");
            getLeads();
        }

    } catch (error) {
        console.log(error);
        alert("Status update failed");
    }
}

// DELETE LEAD

async function deleteLead(id) {

    let confirmDelete = confirm(
        "Delete this lead?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        let response = await fetch(
            "http://localhost:5000/api/leads/" + id,
            {
                method: "DELETE"
            }
        );


        if (response.ok) {

            alert("Lead deleted");

            getLeads();

        }

    } catch (error) {

        console.log(error);

    }

}


// SEARCH

function searchLead() {

    let text = document
        .getElementById("search")
        .value
        .toLowerCase();


    let rows = document
        .getElementById("leadList")
        .getElementsByTagName("tr");


    for (let row of rows) {

        let name = row
            .getElementsByTagName("td")[0]
            .innerText
            .toLowerCase();


        if (name.includes(text)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    }

}


// CLEAR FORM

function clearForm() {

    document.getElementById("name").value = "";

    document.getElementById("email").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("source").value = "";

    document.getElementById("status").value = "New";

    document.getElementById("follow_up").value = "";

    document.getElementById("notes").value = "";

}
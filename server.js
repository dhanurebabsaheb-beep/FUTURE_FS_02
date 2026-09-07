const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root@12345",
    database: "leadflow"
});

db.connect(function(error) {
    if (error) {
        console.log("MySQL connection failed:", error.message);
        return;
    }

    console.log("MySQL connected successfully!");
});

app.get("/api/leads", function(req, res) {
    // res.send("CRM Backend is working!");
    db.query(
        "SELECT * FROM leads ORDER BY id DESC",
        function(error, result) {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Failed to get leads"
                });
            }

            res.json(result);
        }
    );

});



app.post("/api/leads", function(req, res) {

    const { name, email, phone, source, status, follow_up, notes } = req.body;

    const sql = `
        INSERT INTO leads
        (name, email, phone, source, status, follow_up, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, phone, source, status, follow_up, notes],
        function(error, result) {

            if (error) {
                console.log(error);
                return res.status(500).json({
                    message: "Lead add failed"
                });
            }

            res.json({
                message: "Lead added successfully",
                id: result.insertId
            });
        }
    );
});

app.listen(5000, function() {
    console.log("Server started on port 5000");
});

// UPDATE STATUS

app.put("/api/leads/:id", function(req, res) {

    let id = req.params.id;
    let status = req.body.status;

    db.query(
        "UPDATE leads SET status = ? WHERE id = ?",
        [status, id],
        function(error) {

            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Status update failed"
                });
            }

            res.json({
                message: "Status updated successfully"
            });

        }
    );

});
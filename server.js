const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the '../public' directory
app.use(express.static(path.join(__dirname, "../public")));

const usersFile = path.join(__dirname, "../users.txt"); // store users.txt outside server/

// Function to save user credentials
function saveUser(username, password) {
    const userEntry = `${username}:${password}\n`;
    fs.appendFileSync(usersFile, userEntry, "utf8");
}

// Function to check if user exists
function checkUser(username, password) {
    if (!fs.existsSync(usersFile)) return false;
    const users = fs.readFileSync(usersFile, "utf8").split("\n");
    return users.some(entry => entry === `${username}:${password}`);
}

// Serve the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Signup route
app.post("/signup", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required!" });
    }

    saveUser(username, password);
    res.json({ message: "Signup successful!" });
});

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (checkUser(username, password)) {
        res.json({ success: true, message: "Login successful!" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials!" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000; // You can choose any port
const OPENAI_API_KEY = ""; // Replace with your OpenAI API key

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-tip", async (req, res) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).json({ error: "Query cannot be empty" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo", // Use gpt-4 if available
                messages: [
                    { role: "system", content: "You are a helpful assistant providing wellness tips." },
                    { role: "user", content: userQuery }
                ],
                max_tokens: 100,
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const tip = response.data.choices[0].message.content.trim();
        res.json({ tip: tip });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch response from OpenAI" });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

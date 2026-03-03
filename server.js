import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// Store token in environment variable (NOT hardcoded)
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

app.get("/mapbox/*", async (req, res) => {
    try {
        const path = req.originalUrl.replace("/mapbox", "");

        const mapboxUrl =
            `https://api.mapbox.com${path}` +
            (path.includes("?") ? "&" : "?") +
            `access_token=${MAPBOX_TOKEN}`;

        const response = await fetch(mapboxUrl);

        if (!response.ok) {
            return res.status(response.status).send("Mapbox error");
        }

        res.set("Content-Type", response.headers.get("content-type"));
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));

    } catch (err) {
        console.error(err);
        res.status(500).send("Proxy error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
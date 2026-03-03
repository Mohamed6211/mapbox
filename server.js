import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// Store token in environment variable (NOT hardcoded)
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
// server.js
app.get("/mapbox/:style/:z/:x/:y", async (req, res) => {
  const { style, z, x, y } = req.params;
  const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/256/${z}/${x}/${y}?access_token=${process.env.MAPBOX_TOKEN}`;
  
  try {
    const response = await fetch(mapboxUrl);
    const arrayBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).send("Failed to fetch tile");
  }
});

app.get('/', (req, res) => {
  res.send('Mapbox proxy is running');
});
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


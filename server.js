// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// Enable CORS for all origins
app.use(cors());

app.get('/mapbox/terrain-rgb/:z/:x/:y.png', async (req, res) => {
    const { z, x, y } = req.params;
    const token = process.env.MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=${token}`;
    
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/png');
        res.send(Buffer.from(buffer));
    } catch (err) {
        console.error(err);
        res.status(500).send('Tile fetch error');
    }
});

app.get('/', (req, res) => res.send('Mapbox proxy is running'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));


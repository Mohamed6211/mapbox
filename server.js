const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins (or restrict to your domain)
app.use(cors());

// Example route for Mapbox tiles
app.get('/mapbox/:style/:z/:x/:y', async (req, res) => {
  const { style, z, x, y } = req.params;
  const token = process.env.MAPBOX_TOKEN; // or your token variable
  const url = `https://api.mapbox.com/styles/v1/mapbox/${style}/tiles/256/${z}/${x}/${y}?access_token=${token}`;

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

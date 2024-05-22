// Import necessary modules
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import path from 'path';
import { getPrice as getCommexPrice } from './getPriceCommex.js';
import { client as binanceClient } from './getPriceBinance.js';


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});

const symbol = 'BTCUSDT';

const fetchAndLogPriceDifference = async () => {
  try {
    const [commexPrice, binancePrice] = await Promise.all([
      getCommexPrice(symbol),
      binanceClient.getMarkPrice({ symbol }),
    ]);

    const gapPercentage = -100 * (commexPrice.bidPrice - binancePrice.indexPrice) / binancePrice.indexPrice;

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          commexPrice: commexPrice.bidPrice,
          binancePrice: binancePrice.indexPrice,
          gapPercentage: gapPercentage.toFixed(4),
        }));
      }
    });
  } catch {
    // Ignore errors
  }
};

// Run the fetchAndLogPriceDifference function every second
setInterval(fetchAndLogPriceDifference, 1000);

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// This import assumes that your environment is set up for ESM
import dotenv from "dotenv";
import crypto from 'crypto';
import axios from 'axios';
import { USDMClient } from'binance';
//
export const client = new USDMClient({
  api_key: process.env.BINANCE_APIKEY,
  api_secret: process.env.BINANCE_SECRETKEY,
});

client.getMarkPrice({symbol : "BTCUSDT"})  
  .then((result) => {
    console.log('get24hrChangeStatististics inverse futures result: ', result);
  })
  .catch((err) => {
    console.error('get24hrChangeStatististics inverse futures error: ', err);
  });
//   const apiUrl = 'https://api.commex.com/fapi/v1/order';
// // Function to generate HMAC SHA256 signature
// function generateSignature(queryString) {
//   return crypto.createHmac('sha256', secretKey).update(queryString).digest('hex');
// }

// //
// export async function getPrice(symbol) {
//   const baseUrl = 'https://api.commex.com/api/v1/ticker/bookTicker';
//   let url = `${baseUrl}?symbol=${symbol}`;

//   console.log(`Starting fetch for URL: ${url}`);

//   try {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log(data)

//     if (data.length === 0) {
//       console.log('No ticker information available for the provided parameters.');
//     }

//     return data;
//   } catch (error) {
//     console.error('Failed to fetch Kline/Candlestick data:', error);
//   }
// }
// getPrice("BTCUSDT")

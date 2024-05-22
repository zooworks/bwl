import dotenv from "dotenv";
import crypto from 'crypto';
import axios from 'axios';
import { getPrice } from './getPriceCommex.js';

const apiUrl = 'https://api.commex.com/fapi/v1/order';

// Function to generate HMAC SHA256 signature
function generateSignature(queryString) {
    return crypto.createHmac('sha256',process.env.COMMEX_SECRETKEY,).update(queryString).digest('hex');
}

export async function placeOrder(symbol, side, price) {
    const timestamp = Date.now();
    try {
        const params = new URLSearchParams({
            symbol: symbol,
            side: side,
            type: 'market',
            quantity: '0.001',
            price: price,
            timeInForce: 'GTC',
            recvWindow: '5000',
            timestamp: timestamp
        });
        
        const signature = generateSignature(params.toString());
        params.append('signature', signature);
        
        const response = await axios.post(apiUrl, params.toString(), {
            headers: {
                'X-MBX-APIKEY': process.env.COMMEX_APIKEY,
               'Content-Type': 'application/x-www-form-urlencoded' //is not needed since axios sets it automatically when params is a URLSearchParams object
            }
        });
        
        // console.log(response.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            console.error(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
    }
}

// Call the placeOrder function
// placeOrder('BTCUSDT', 'BUY', 66000);
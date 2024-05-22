import { getPrice as getCommexPrice } from './getPriceCommex.js'; // Commex에서 가격정보 불러오기
import { placeOrder } from "./postOrderCommex.js"; // Commex에서 주문넣기
import { client } from "./getPriceBinance.js"; // Binance에서 가격정보 불러오기
import { placeSellOrder } from "./postOrderBinance.js"; // Binance에서 주문넣기

const OPEN_THRESHOLD = 1; // 아비트리지 기회를 여는 최소 가격 차이
const TRANSACTION_COST = 0.001; // 예시 거래 비용, 실제 값으로 조정 필요

async function arbitrageOpportunity() {
  try {
    console.log("실행")
    // Commex에서 BTCUSDT 가격 정보 가져오기
    const { bidPrice: commexBid, askPrice: commexAsk } = await getCommexPrice('BTCUSDT');

    // Binance에서 BTCUSDT 가격 정보 가져오기
    const binanceResponse = await client.getMarkPrice({ symbol: "BTCUSDT" });
    const binancePrice = parseFloat(binanceResponse.indexPrice);

    console.log(`Commex Bid: ${commexBid}, Commex Ask: ${commexAsk}, Binance Price: ${binancePrice}`);

    // 아비트리지 기회 탐색
    if (binancePrice - commexAsk > OPEN_THRESHOLD + TRANSACTION_COST) {
      console.log('Arbitrage Opportunity: Buying on Commex and Selling on Binance');
      // Commex에서 구매 주문 실행
      await placeOrder('BTCUSDT', 'BUY', commexAsk.toFixed(2));
      // Binance에서 판매 주문 실행
      await placeSellOrder('BTCUSDT', binancePrice, 'SELL');
    } else if (commexBid - binancePrice > OPEN_THRESHOLD + TRANSACTION_COST) {
      console.log('Arbitrage Opportunity: Buying on Binance and Selling on Commex');
      // Binance에서 구매 주문 실행
      await placeSellOrder('BTCUSDT', binancePrice, 'BUY');
      // Commex에서 판매 주문 실행
      await placeOrder('BTCUSDT', 'SELL', commexBid);
    } else {
      console.log('No arbitrage opportunity at the moment');
    }
  } catch (error) {
    console.error('Error in arbitrageOpportunity function:', error);
  }
}

// 아비트리지 전략 실행
setInterval(arbitrageOpportunity, 2000); // 1초마다 실행

//Binance에서 주문을 넣는 코드
import Binance from'binance-api-node';
import { client } from './getPriceBinance.js';


// 판매 주문 실행 함수
export async function placeSellOrder(symbol, quantity, side) {
  try {
    const order = await client.submitNewOrder({
      symbol: symbol,
      side: side,
      type: 'MARKET',
      quantity: quantity,
    });

    console.log('Order executed', order);
  } catch (error) {
    console.error('Order failed', error);
  }
}

// 'BTCUSDT' 마켓에 0.01 BTC를 판매하는 주문을 실행
// placeSellOrder('BTCUSDT', 0.01);
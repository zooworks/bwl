import { getPrice } from "./getPriceCommex.js"; //commex에서 가격정보 불러오기
import{placeOrder} from "./postOrderCommex.js"; //commex에서 주문넣기
import { client } from "./getPriceBinance.js"; //binance에서 가격정보 불러오기
import{order} from "./postOrderBinance.js";//binance에서 주문넣기

getPrice('BTCUSDT').then((price) => {
  console.log(price);
  placeOrder('BTCUSDT', 'SELL', price);
});

order('BTCUSDT',66000, 'SELL');
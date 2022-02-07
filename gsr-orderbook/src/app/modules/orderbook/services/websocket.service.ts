import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WEBSOCKET } from '../models/constants/url-paths';


@Injectable({
  providedIn: 'root'
})
  
export class WebsocketService {
  
  public $productSpecificConnection: WebSocketSubject<any> = webSocket(WEBSOCKET.COINBASE.FEED_EXCHANGE);
  public $productsAndCurrenciesConnection: WebSocketSubject<any> = webSocket(WEBSOCKET.COINBASE.FEED_EXCHANGE);

  constructor() { }
  

  public getProducts() {
    return this.$productSpecificConnection;
  }

  public getProductsAndCurrencies() {
    return this.$productsAndCurrenciesConnection;
  }

}

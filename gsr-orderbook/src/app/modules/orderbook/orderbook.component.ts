import { Component, OnInit } from '@angular/core';
import { CONNECTION_TYPE, ORDER_TYPES } from './models/constants/orderbook';
import { Products, ProductsAndCurrencies, ProductSpecificOrders } from './models/interfaces/orderbook';
import { WebsocketService } from './services/websocket.service';
import { sortArray } from './utils/orderbook-utils';

@Component({
  selector: 'gsr-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss']
})
export class OrderbookComponent implements OnInit {

  productOrders: Array<ProductSpecificOrders>;
  buyingOrders: Array<any> = [];
  sellingOrders: Array<any> = [];
  products: Array<Products> = [];

  constructor(private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    this.getProductOrderbookData();
    this.getProductAndCurrenciesData();

    this.sendProductsAndCurrenciesHeartbeat();
    this.sendProductSpecificHeartbeat();
  }

  private getProductOrderbookData() {
    this.productOrders = [];
    this.webSocketService.getProducts().asObservable().subscribe((data: ProductSpecificOrders) => {
      console.log(data);
      this.setOrderbookData(data);
    })
  }

  private getProductAndCurrenciesData() {
    this.webSocketService.getProductsAndCurrencies().asObservable().subscribe((data: ProductsAndCurrencies) => {
      console.log('productsAndCurrencies:', data);
      const { products, currencies, type } = data;
      if (type === CONNECTION_TYPE.STATUS) {
        this.products = products;  
      }
    });
  }

  private setOrderbookData(productOrder: ProductSpecificOrders) {
    if (productOrder?.type === CONNECTION_TYPE.LEVEL2) {
      const { changes } = productOrder;
      const details = changes[0];
      if (details) {
        const type = details[0] || 'none';
        const price = details[1];
        const size = details[2];

        if (this.buyingOrders.length > 10) {
          this.buyingOrders = [];
        }
        if (this.sellingOrders.length > 10) {
          this.sellingOrders = [];
        }
        if (type === ORDER_TYPES.BUY_OPEN_ORDERS) {
          const buyOrders = [];
          buyOrders.push(this.setOrder(type, price, size));
          const sorttedBuyOrders = sortArray(buyOrders);
          this.buyingOrders = sortArray(buyOrders);
        } else {
          const sellOrders = [];
          sellOrders.push(this.setOrder(type, price, size));
          this.sellingOrders = sortArray(sellOrders);
        }  
      } 
    }
  }

  private setOrder(type, price, size) {
    return {
      type,
      price,
      size,
      total: this.calculateTotalOrdersPerTransaction(price, size)
    }
  }

  private calculateTotalOrdersPerTransaction(price, size) {
    const total = price * size;
    return total || 0;
  }


  // ****************HEARTBEAT MESSAGES****************
  private sendProductsAndCurrenciesHeartbeat() {
    this.webSocketService.$productsAndCurrenciesConnection.next(
      {
        "type": "subscribe",
        "channels": [{ "name": "status"}]
      }
    );
  }

  private sendProductSpecificHeartbeat() {
    this.webSocketService.$productSpecificConnection.next(
      {
        type: "subscribe", 
        product_ids: ["YFI-USD"], 
        channels: ["level2"]
      }
    );
      
  }

}

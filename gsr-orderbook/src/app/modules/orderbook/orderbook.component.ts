import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CONNECTION_TYPE, ORDERBOOK_DATA, ORDER_TYPES, PRODUCT } from './models/constants/orderbook';
import { Products, ProductsAndCurrencies, ProductSpecificOrders } from './models/interfaces/orderbook';
import { WebsocketService } from './services/websocket.service';
import { sortArray } from './utils/orderbook-utils';

@Component({
  selector: 'gsr-orderbook',
  templateUrl: './orderbook.component.html',
  styleUrls: ['./orderbook.component.scss']
})
export class OrderbookComponent implements OnInit, OnDestroy {

  productOrders: Array<ProductSpecificOrders>;
  buyingOrders: Array<any> = [];
  sellingOrders: Array<any> = [];
  products: Array<Products> = [];
  product = PRODUCT.default;

  private $productOrder: Subscription;
  private $productAndCurrencies: Subscription;

  constructor(private webSocketService: WebsocketService) { }

  // this initiate all websocket subscriptions
  ngOnInit(): void {
    this.getProductOrderbookData();
    this.getProductAndCurrenciesData();

    this.sendProductsAndCurrenciesHeartbeat();
    this.sendProductSpecificHeartbeat();
  }

  // destroys all subscriptions when leaving the page
  ngOnDestroy(): void {
    if (this.$productOrder) {
      this.$productOrder.unsubscribe();
    }
    if (this.$productAndCurrencies) {
      this.$productAndCurrencies.unsubscribe();
    }
  }

  // when a new product is selected, this unsubscribe 
  // previous connection and reconnects to a new one
  onProductSelected(product) {
    this.product = product;
    if (product) {
      this.reconnectProduct(product);
    }
  }

  // reconnection to product subscription
  private reconnectProduct(product?: string) {
    if (this.$productOrder) {
      this.$productOrder.unsubscribe();
    }
    this.getProductOrderbookData();
    this.sendProductSpecificHeartbeat(product);
  }

  // reconnection to products and currencies
  private reconnectProductsAndCurrencies() {
    if (this.$productAndCurrencies) {
      this.$productAndCurrencies.unsubscribe();
    }
    this.getProductAndCurrenciesData();
    this.sendProductsAndCurrenciesHeartbeat();
  }

  // subscription to product data -- via websocket connection
  private getProductOrderbookData() {
    this.productOrders = [];
    this.$productOrder = this.webSocketService.getProducts().asObservable().subscribe(
      (data: ProductSpecificOrders) => {
        this.setOrderbookData(data);
      }, () => {
        this.reconnectProduct();
    })
  }

  // subscription to products and currencies data -- via websocket connection
  private getProductAndCurrenciesData() {
    this.$productAndCurrencies = this.webSocketService.getProductsAndCurrencies().asObservable()
      .subscribe(
        (data: ProductsAndCurrencies) => {
          const { products, type } = data;
          if (type === CONNECTION_TYPE.STATUS) {
            this.products = sortArray(products, PRODUCT.properties.sortedBy.id);  
          }
        }, () => {
          this.reconnectProductsAndCurrencies();
      });
  }

  // function that mold product data to be ready to be displayed in the UI
  private setOrderbookData(productOrder: ProductSpecificOrders) {
    if (productOrder?.type === CONNECTION_TYPE.LEVEL2) {
      const { changes } = productOrder;
      const details = changes[0];
      if (details) {
        const type = details[0] || ORDERBOOK_DATA.default;
        const price = details[1];
        const size = details[2];

        if (type === ORDER_TYPES.BUY_OPEN_ORDERS) {
          const buyOrder = this.setOrder(type, price, size);
          this.buyingOrders.push(buyOrder);

          if (this.buyingOrders.length > 10) {
            this.buyingOrders.shift();
          } 
            
        } else {
          const sellOrder = this.setOrder(type, price, size);
          this.sellingOrders.push(sellOrder);
          
          if (this.sellingOrders.length > 10) {
            this.sellingOrders.shift();
          }

        }  
      } 
    }
  }

  // function that set an order
  private setOrder(type, price, size) {
    return {
      type,
      price,
      size,
      total: this.calculateTotalOrdersPerTransaction(price, size)
    }
  }

  // function that calculates order for each transaction
  private calculateTotalOrdersPerTransaction(price, size) {
    const total = price * size;
    return total || 0;
  }

  // *******************  HEARTBEAT MESSAGES   *******************
  
  private sendProductsAndCurrenciesHeartbeat() {
    this.webSocketService.$productsAndCurrenciesConnection.next(
      {
        "type": "subscribe",
        "channels": [{ "name": "status"}]
      }
    );
  }

  private sendProductSpecificHeartbeat(product?: string) {
    const product_ids = product || PRODUCT.default;
    this.webSocketService.$productSpecificConnection.next(
      {
        type: "subscribe", 
        product_ids: [product_ids], 
        channels: ["level2"]
      }
    );
  }

}

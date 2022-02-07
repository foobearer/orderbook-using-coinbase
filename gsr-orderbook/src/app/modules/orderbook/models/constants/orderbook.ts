export const ORDER_TYPES = {
  SELL_OPEN_ORDERS: 'sell',
  BUY_OPEN_ORDERS: 'buy',
}

export const CONNECTION_TYPE = {
  SNAPSHOT: 'snapshot',
  SUBSCRIPTION: 'subscription',
  LEVEL2: 'l2update',
  STATUS: 'status'
}

export const PRODUCT = {
  default: 'ETH-USD',
  properties: {
    sortedBy: {
      id: 'id'
    }  
  }
}

export const ORDERBOOK_DATA = {
  default: 'none',
}

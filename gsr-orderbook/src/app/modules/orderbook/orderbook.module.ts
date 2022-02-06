import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderbookRoutingModule } from './orderbook-routing.module';
import { OrderbookComponent } from './orderbook.component';


@NgModule({
  declarations: [OrderbookComponent],
  imports: [
    CommonModule,
    OrderbookRoutingModule
  ]
})
export class OrderbookModule { }

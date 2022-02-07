import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderbookRoutingModule } from './orderbook-routing.module';
import { OrderbookComponent } from './orderbook.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { NbIconModule, NbSelectModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [OrderbookComponent, ProductListComponent],
  imports: [
    CommonModule,
    NbSelectModule,
    OrderbookRoutingModule,
    FormsModule,
    NbIconModule
  ]
})
export class OrderbookModule { }

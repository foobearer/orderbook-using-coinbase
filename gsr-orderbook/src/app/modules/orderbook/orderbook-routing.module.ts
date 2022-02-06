import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderbookComponent } from './orderbook.component';

const routes: Routes = [{ path: '', component: OrderbookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderbookRoutingModule { }

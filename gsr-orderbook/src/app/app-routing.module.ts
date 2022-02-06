import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'orderbook', loadChildren: () => import('./modules/orderbook/orderbook.module').then((m) => m.OrderbookModule) },
  { path: '', loadChildren: () => import('./modules/orderbook/orderbook.module').then((m) => m.OrderbookModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

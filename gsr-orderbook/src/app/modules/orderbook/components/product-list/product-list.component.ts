import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'gsr-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() products: Array<any>;
  @Output() product: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  // function that sends out selected product from the component
  emitSelectedProduct(product) {
    console.log(product);
    this.product.emit(product);
  }

}

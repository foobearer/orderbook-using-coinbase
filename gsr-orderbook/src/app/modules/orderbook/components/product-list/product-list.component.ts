import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'gsr-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() products: Array<any>;
  @Output() selectedProduct: EventEmitter<any> = new EventEmitter<any>();

  selectedItem;
  
  constructor() { }

  ngOnInit(): void {
  }

}

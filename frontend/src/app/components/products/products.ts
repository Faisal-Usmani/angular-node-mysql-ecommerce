import { Component, inject } from '@angular/core';
import { Product } from '../home/types/products.type';
import { ProductsService } from '../home/services/product/products.service';
import { CommonModule } from '@angular/common';
import { Ratings } from '../ratings/ratings';
import { ProductsStoreItem } from '../home/services/product/products.storeItem';
import { CartStoreItem } from '../home/services/cart/cart.storeItem';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';

import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule,Ratings,FontAwesomeModule,RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers:[ProductsService]
})
export class Products {
 faBoxOpen=faBoxOpen;
faShoppingCart = faShoppingCart;

  constructor(
    public productsStoreItem: ProductsStoreItem,
    private cart: CartStoreItem
  ) {}

  addToCart(product: Product) {
    this.cart.addProduct(product);
  }
}

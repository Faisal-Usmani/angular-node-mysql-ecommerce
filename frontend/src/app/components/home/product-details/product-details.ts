import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../services/product/products.service';
import { Product } from '../types/products.type';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Ratings } from '../../ratings/ratings';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartStoreItem } from '../services/cart/cart.storeItem';

@Component({
  selector: 'app-product-details',
  imports: [Ratings, CommonModule, FontAwesomeModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartStoreItem);

  readonly product = signal<Product | null>(null);
  faShoppingCart = faShoppingCart;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id !== null && !isNaN(id)) {
      this.productsService
        .getProduct(id)
        .pipe(takeUntilDestroyed())
        .subscribe((res) => {
          this.product.set(Array.isArray(res) ? res[0] : res);
        });
      return;
    }
  }
  addToCart() {
    const product = this.product();
    if (product) {
      this.cart.addProduct(product);
    }
  }
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.jpg';
  }
}

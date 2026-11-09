import { Component, output, signal } from '@angular/core';
import { CategoriesStoreItem } from '../services/category/categories.storeItem';
import { Category } from '../types/category';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { ProductsStoreItem } from '../services/product/products.storeItem';

@Component({
  selector: 'app-catnavigation',
  imports: [RouterLink],
  templateUrl: './catnavigation.html',
  styleUrl: './catnavigation.css',
})
export class Catnavigation {
  // readonly categoryClicked=output<number>();
  readonly mainCategoryClicked = output<number>();
  displayOption = signal(true);

  constructor(
    public categoriesStoreItem: CategoriesStoreItem,
    private router: Router,
    private productsStoreItemn: ProductsStoreItem,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.displayOption.set(event.url === '/home/products');
      });
  }

  onCategoryClicked(mainCategory: Category) {
    this.mainCategoryClicked.emit(mainCategory.id);
  }
  onHomeClicked() {
    this.productsStoreItemn.loadProducts();
  }
}

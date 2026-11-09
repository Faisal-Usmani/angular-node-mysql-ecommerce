import { Component } from '@angular/core';
import { Catnavigation } from './catnavigation/catnavigation';
import { Header } from './header/header';
import { CategoriesStoreItem } from './services/category/categories.storeItem';
import { CategoryService } from './services/category/category.service';
import { ProductsStoreItem } from './services/product/products.storeItem';
import { ProductsService } from './services/product/products.service';
import { SearchKeyword } from './types/searchKeyword.type';
import { RouterOutlet } from '@angular/router';
import { CartStoreItem } from './services/cart/cart.storeItem';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UserService } from './services/user/user.service';
import { OrderService } from './services/order/order.service';

@Component({
  selector: 'app-home',
  imports: [Catnavigation, Header, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [
    CategoryService, 
    ProductsService,
    CategoriesStoreItem, 
    ProductsStoreItem,
    CartStoreItem,
    OrderService,
    UserService]
})
export class Home {
  constructor(private categoriesStoeItem: CategoriesStoreItem,
    private productsStoreItemn: ProductsStoreItem,
    private router: Router
  ) {

    
    // As soon as Home Component loaded Categories,products will fetch and save it in store
    this.categoriesStoeItem.loadCategories();
    this.productsStoreItemn.loadProducts();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(
      (event) => {
        if ((event as NavigationEnd).url === '/home') {
          this.router.navigate(['/home/products']);
        }
      }
    )

  }


  onMainCategoryClick(mainCategoryId: number) {
    this.productsStoreItemn.loadProducts({ maincategoryid: mainCategoryId });
  }
  onSearchKeyword(searchKeyword: SearchKeyword) {
    this.productsStoreItemn.loadProducts({
      maincategoryid: searchKeyword.categoryId,
      keyword: searchKeyword.keyword
    });
  }
}



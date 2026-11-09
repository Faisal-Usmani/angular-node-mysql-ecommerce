import { Component, computed, effect, output, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSearch,
  faUserCircle,
  faShoppingCart,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { CategoriesStoreItem } from '../services/category/categories.storeItem';
import { SearchKeyword } from '../types/searchKeyword.type';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule,RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  faSearch = faSearch;
  faUserCircle = faUserCircle;
  faShoppingCart = faShoppingCart;
  faChevronDown = faChevronDown;

  dropdownVisible = false;
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  readonly searchClicked = output<SearchKeyword>();
  displaySearch = signal(true);
  isUserAuthenticated = signal(false);
  userName = signal('');
  // userCart=computed(()=>this.cart.map())

  constructor(
    public categoryStore: CategoriesStoreItem,
    private router: Router,
    public cart: CartStoreItem,
    public userService: UserService
  ) {
    console.log('cart',this.cart)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.displaySearch.set(event.url === '/home/products');
      });

    const isUserAuthenticatedSignal = toSignal(
      this.userService.isUserAuthenticated$,
      { initialValue: false }
    );
    const loggedInUserSignal = toSignal(this.userService.loggedInUser$, {
      initialValue: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        pin: '',
        email: '', //new
      },
    });

    effect(() => {
      this.isUserAuthenticated.set(isUserAuthenticatedSignal());
      this.userName.set(loggedInUserSignal().firstName);
    });
  }

  onClickSearch(keyword: string, categoryId: string): void {
    this.searchClicked.emit({
      categoryId: parseInt(categoryId),
      keyword: keyword,
    });
  }

  navigateToCart(): void {
    this.router.navigate(['home/cart']);
  }

  pastOrders(): void {
    this.dropdownVisible = false;
    this.router.navigate(['home/pastorders']);
  }

  logout(): void {
    this.dropdownVisible = false;
    this.userService.logout();
  }
}

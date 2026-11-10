import { Component, effect, signal, WritableSignal } from '@angular/core';
import { faTrash, faBoxOpen, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartItem } from '../types/cart.type';
import { Router, ActivatedRoute } from '@angular/router';
import { CartStoreItem } from '../services/cart/cart.storeItem';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ratings } from '../../ratings/ratings';
import { LoggedInUser } from '../types/user.type';
import { UserService } from '../services/user/user.service';
import { OrderService } from '../services/order/order.service';
import { RazorpayService } from '../services/razorpay/razorpay';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [FontAwesomeModule, Ratings, CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  faTrash = faTrash;
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;

  alertType: number = 0;
  alertMessage: string = '';
  disableCheckout: boolean = false;
  paymentSuccess = signal(false); //new

  user = signal<LoggedInUser>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    email: '',
  });

  orderForm: WritableSignal<FormGroup>;

  constructor(
    public cartStore: CartStoreItem,
    private router: Router,
    private route: ActivatedRoute, //new
    private userService: UserService,
    private fb: FormBuilder,
    private orderService: OrderService,
    private razorpayService: RazorpayService, //new
  ) {
    this.orderForm = signal(this.createOrderForm(this.user()));

    effect(() => {
      const newUser = this.user();
      this.orderForm.set(this.createOrderForm(newUser));
    });

    // Handle Stripe redirect query params
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          if (params['status'] === 'success' && !this.paymentSuccess()) {
            this.paymentSuccess.set(true);

            // Restore form from localStorage
            const storedFormData = localStorage.getItem('orderFormData');
            if (storedFormData) {
              try {
                const formData = JSON.parse(storedFormData);
                this.orderForm().patchValue(formData);
                localStorage.removeItem('orderFormData');
              } catch (error) {
                console.error('Error parsing stored form data:', error);
                this.alertType = 2;
                this.alertMessage = 'Failed to restore your address. Please retry.';
                return of(null);
              }
            }
            return this.userService.loggedInUser$;
          } else if (params['status'] === 'cancel') {
            this.alertType = 2;
            this.alertMessage = 'Payment was cancelled.';
            return of(null);
          } else {
            return of(null);
          }
        }),
      )
      .subscribe((user) => {
        if (user && this.paymentSuccess()) {
          this.user.set(user);
          this.saveOrder();
        }
      });

    this.userService.loggedInUser$.subscribe((u) => this.user.set(u));
  }

  private createOrderForm(user: LoggedInUser | null): FormGroup {
    return this.fb.group({
      name: [
        user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}`.trim() : '',
        Validators.required,
      ],
      address: [user?.address || '', Validators.required],
      city: [user?.city || '', Validators.required],
      state: [user?.state || '', Validators.required],
      pin: [user?.pin || '', Validators.required],
    });
  }

  navigateToHome(): void {
    this.router.navigate(['home/products']);
  }

  updateQuantity($event: any, cartItem: CartItem): void {
    if ($event.target.innerText === '+') {
      this.cartStore.addProduct(cartItem.product);
    } else if ($event.target.innerText === '-') {
      this.cartStore.decreaseProductQuantity(cartItem);
    }
  }

  removeItem(cartItem: CartItem): void {
    this.cartStore.removeProduct(cartItem);
  }

  async checkout(): Promise<void> {
    // 1. Check authentication
    if (!this.userService.isUserAuthenticated) {
      this.alertType = 2;
      this.alertMessage = 'Please log in to proceed with payment.';
      return;
    }

    // 2. Validate cart and delivery form
    if (this.cartStore.cart().products.length === 0) {
      this.alertType = 2;
      this.alertMessage = 'Your cart is empty.';
      return;
    }

    if (this.orderForm().invalid) {
      this.orderForm().markAllAsTouched();
      this.alertType = 2;
      this.alertMessage = 'Please fill in the delivery address to continue.';
      return;
    }

    // 3. Save delivery address temporarily
    localStorage.setItem('orderFormData', JSON.stringify(this.orderForm().value));

    // 4. Disable checkout button
    this.disableCheckout = true;

    try {
      // 5. Start Razorpay payment
      await this.razorpayService.payWithRazorpay(this.cartStore.cart().products);
    } catch (error: any) {
      console.error('Checkout error:', error);

      this.alertType = 2;
      this.alertMessage = error?.message || 'Unable to initiate payment.';

      this.disableCheckout = false;
    }
  }

  private saveOrder(): void {
    const form = this.orderForm();

    const deliveryAddress = {
      userName: form.get('name')?.value,
      address: form.get('address')?.value,
      city: form.get('city')?.value,
      state: form.get('state')?.value,
      pin: form.get('pin')?.value,
    };

    const email = this.user()?.email;

    if (!email) {
      this.alertType = 2;
      this.alertMessage = 'Email missing. Please log in again.';
      return;
    }

    this.orderService.saveOrder(deliveryAddress, email).subscribe({
      next: () => {
        this.cartStore.clearCart();
        this.alertType = 0;
        this.alertMessage = 'Order placed successfully!';
        this.disableCheckout = true;
        this.orderForm.set(this.createOrderForm(this.user()));
      },
      error: (error) => {
        this.alertType = 2;
        this.alertMessage = error.error?.message || 'Order save failed.';
      },
    });
  }
}

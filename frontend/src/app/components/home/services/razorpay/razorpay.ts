import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { CartItem } from '../../types/cart.type';
import { RazorpayOrder, RazorpayPaymentResponse } from '../../types/razorpay.type';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class RazorpayService {
  private apiUrl = 'http://localhost:5001/api/v1/checkout';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // ===================================
  // LOAD RAZORPAY SDK
  // ===================================

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if SDK is already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      // Avoid loading the same script multiple times
      const existingScript = document.getElementById(
        'razorpay-checkout-js',
      ) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true), { once: true });

        existingScript.addEventListener('error', () => resolve(false), { once: true });

        return;
      }

      const script = document.createElement('script');

      script.id = 'razorpay-checkout-js';

      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  }

  // ===================================
  // START RAZORPAY PAYMENT
  // ===================================

  async payWithRazorpay(cartItems: CartItem[]): Promise<void> {
    try {
      // 1. Validate cart
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty.');
      }

      // 2. Load Razorpay SDK
      const loaded = await this.loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error('Razorpay SDK failed to load.');
      }

      // 3. Create Razorpay order from backend
      const order = await firstValueFrom(this.createOrder(cartItems));

      console.log('Razorpay order:', order);

      // 4. Validate backend response
      if (
        !order ||
        !order.success ||
        !order.orderId ||
        !order.keyId ||
        !order.amount ||
        !order.currency
      ) {
        throw new Error('Invalid Razorpay order response.');
      }

      if (!order.keyId.startsWith('rzp_test_') && !order.keyId.startsWith('rzp_live_')) {
        throw new Error('Invalid Razorpay Key ID.');
      }

      // 5. Configure Razorpay Checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'My Store',
        description: 'Order Payment',
        order_id: order.orderId,

        prefill: {
          name: '',
          email: '',
        },

        theme: {
          color: '#3399cc',
        },

        // 6. Payment success handler
        handler: async (response: RazorpayPaymentResponse) => {
          console.log('Payment response:', response);

          try {
            // Verify payment on backend
            const result = await firstValueFrom(this.verifyPayment(response));

            console.log('Verification result:', result);

            if (result.success) {
              console.log('Payment successfully verified.');

              await this.router.navigate(['/home/cart'], {
                queryParams: {
                  status: 'success',
                },
              });
            } else {
              throw new Error('Payment verification failed.');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);

            await this.router.navigate(['/home/cart'], {
              queryParams: {
                status: 'payment_verification_failed',
              },
            });
          }
          0;
        },

        // 7. Checkout popup dismissed
        modal: {
          ondismiss: () => {
            console.log('Razorpay checkout popup dismissed.');
          },
        },
      };

      // 8. Initialize Razorpay
      const razorpay = new window.Razorpay(options);

      // 9. Handle payment failure
      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);

        console.error('Error code:', response.error?.code);
        console.error('Error description:', response.error?.description);
        console.error('Error reason:', response.error?.reason);

        this.router.navigate(['/home/cart'], {
          queryParams: {
            status: 'payment_failed',
          },
        });
      });

      // 10. Open Razorpay Checkout
      console.log('Opening Razorpay Checkout...');

      razorpay.open();
    } catch (error: any) {
      console.error('Razorpay checkout error:', error);

      console.error('Error message:', error?.message);

      await this.router.navigate(['/home/cart'], {
        queryParams: {
          status: 'checkout_error',
        },
      });
    }
  }

  // ===================================
  // CREATE RAZORPAY ORDER
  // ===================================

  private createOrder(cartItems: CartItem[]) {
    const body = {
      cartItems: cartItems.map((item) => ({
        name: item.product.product_name,

        price: item.product.price,

        quantity: item.quantity,
      })),
    };

    return this.http.post<RazorpayOrder>(`${this.apiUrl}/create-order`, body);
  }

  // ===================================
  // VERIFY RAZORPAY PAYMENT
  // ===================================

  private verifyPayment(response: RazorpayPaymentResponse) {
    return this.http.post<{
      success: boolean;
      message: string;
      paymentId?: string;
    }>(`${this.apiUrl}/verify-payment`, response);
  }
}

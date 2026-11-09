export interface RazorpayOrder {
  success: boolean;
  message: string;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

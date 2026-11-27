import { FormEvent, useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { BRAND_CONTACT } from '../data/products';
import { CartItem, PackSize, Product } from '../types';
import { ProductImage } from './ProductImage';
import { isSupabaseConfigured, supabase } from '../supabase';

interface CartDrawerProps {
  products: Product[];
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, packSize: PackSize, delta: number) => void;
  onRemoveItem: (productId: string, packSize: PackSize) => void;
  onClearCart: () => void;
  onBrowseShop: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'confirmed';
type PaymentMethod = 'UPI / Cards' | 'Cash on Delivery (COD)';

interface ConfirmedReceipt {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: PaymentMethod;
  totalInr: number;
  itemSummary: string[];
}

const FREE_SHIPPING_THRESHOLD = 1499;
const FLAT_SHIPPING_FEE = 95;

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export function CartDrawer({
  products,
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseShop,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI / Cards');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ConfirmedReceipt | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length === 0 && step === 'checkout') {
      setStep('cart');
    }
  }, [isOpen, items.length, step]);

  if (!isOpen) return null;

  const resolvedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      const variant = product.packs[item.packSize];
      if (!variant || variant.priceInr <= 0 || variant.isActive === false) return null;

      return {
        ...item,
        product,
        unitPrice: variant.priceInr,
        sku: variant.sku,
        lineTotal: variant.priceInr * item.quantity,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const subtotal = resolvedItems.reduce((sum, entry) => sum + entry.lineTotal, 0);
  const qualifiesFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingFee =
    resolvedItems.length === 0 || qualifiesFreeShipping ? 0 : FLAT_SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pincode.trim()
    ) {
      setFormError('Please complete all required delivery details.');
      return;
    }

    if (resolvedItems.length !== items.length) {
      setFormError('Some items in your bag are unavailable or have a price pending. Please remove them before checkout.');
      return;
    }

    if (resolvedItems.length === 0) {
      setFormError('Your shopping bag is empty or contains unavailable items.');
      return;
    }

    if (resolvedItems.some((entry) => {
      const stock = entry.product.packs[entry.packSize]?.stockQuantity;
      return stock !== undefined && stock < entry.quantity;
    })) {
      setFormError('One or more items no longer have enough stock. Please update your bag.');
      return;
    }

    if (resolvedItems.some((entry) => !entry.product.supabaseId)) {
      setFormError('The product catalogue is still syncing. Please try again shortly or contact us on WhatsApp.');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setFormError('Online ordering is being configured. Please contact Zestora Hills on WhatsApp to place your order.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    let paymentWindowOpen = false;

    try {
      const orderItems = resolvedItems.map((entry) => ({
        product_id: entry.product.supabaseId,
        pack_size: entry.packSize,
        quantity: entry.quantity,
      }));

      const customerDetails = {
        customer_name: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        delivery_address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        items: orderItems,
      };

      const summaryLines = resolvedItems.map(
        (entry) =>
          `${entry.product.name} (${entry.packSize}) × ${entry.quantity}`
      );

      if (paymentMethod === 'Cash on Delivery (COD)') {
        const { data, error } = await supabase.functions.invoke('create-order', {
          body: {
            ...customerDetails,
            payment_method: 'Cash on Delivery (COD)',
          },
        });

        if (error) {
          throw new Error(error.message || 'Unable to submit your order.');
        }

        if (!data || !data.success || !data.order_id) {
          throw new Error(data?.error || 'Your order could not be created.');
        }

        setReceipt({
          orderId: data.order_id,
          customerName: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          paymentMethod,
          totalInr: Number(data.total_amount),
          itemSummary: summaryLines,
        });

        onClearCart();
        setStep('confirmed');
        return;
      }

      const { data: paymentData, error: paymentError } =
        await supabase.functions.invoke('create-razorpay-order', {
          body: customerDetails,
        });

      if (paymentError) {
        throw new Error(paymentError.message || 'Unable to start online payment.');
      }

      if (
        !paymentData?.success ||
        !paymentData.internal_order_id ||
        !paymentData.razorpay_order_id ||
        !paymentData.key_id ||
        !paymentData.amount ||
        !paymentData.currency
      ) {
        throw new Error(paymentData?.error || 'Unable to prepare your payment.');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('The secure payment window could not be loaded. Please try again.');
      }

      const checkout = new window.Razorpay({
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Zestora Hills',
        description: 'Order payment',
        order_id: paymentData.razorpay_order_id,
        prefill: {
          name: customerName.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: { color: '#173C2B' },
        modal: {
          ondismiss: () => {
            paymentWindowOpen = false;
            setIsSubmitting(false);
            setFormError('Payment was cancelled. Your order has not been confirmed.');
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const { data: verificationData, error: verificationError } =
              await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  internal_order_id: paymentData.internal_order_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              });

            if (verificationError || !verificationData?.success) {
              throw new Error(
                verificationData?.error ||
                  verificationError?.message ||
                  'Payment verification could not be completed.'
              );
            }

            setReceipt({
              orderId: paymentData.internal_order_id,
              customerName: customerName.trim(),
              phone: phone.trim(),
              address: address.trim(),
              city: city.trim(),
              pincode: pincode.trim(),
              paymentMethod,
              totalInr: Number(paymentData.amount) / 100,
              itemSummary: summaryLines,
            });

            onClearCart();
            setStep('confirmed');
            setFormError('');
          } catch (verificationError) {
            console.error('Payment verification error:', verificationError);
            setFormError(
              'Your payment response was received, but confirmation is still pending. Please contact Zestora Hills before trying to pay again.'
            );
          } finally {
            paymentWindowOpen = false;
            setIsSubmitting(false);
          }
        },
      });

      paymentWindowOpen = true;
      checkout.open();
    } catch (error) {
      console.error('Checkout error:', error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
      paymentWindowOpen = false;
      setIsSubmitting(false);
    } finally {
      if (!paymentWindowOpen) {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setReceipt(null);
    }
    onClose();
  };

  const whatsappReceiptHref = receipt
    ? `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
        `Hello Zestora Hills! I just placed order ${receipt.orderId} (${receipt.itemSummary.join(
          ', '
        )}) for ₹${receipt.totalInr.toLocaleString('en-IN')} (${receipt.paymentMethod}). Delivery address: ${receipt.address}, ${receipt.city}, PIN ${receipt.pincode}.`
      )}`
    : '#';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#10291D]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
      onClick={handleCloseDrawer}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-[#F3EBDD] text-[#173C2B] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#173C2B]/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Return to shopping bag"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#52665A] hover:bg-[#E9E2D3] hover:text-[#173C2B] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            <h2 className="font-serif text-2xl font-semibold text-[#173C2B]">
              {step === 'cart' && 'Shopping Bag'}
              {step === 'checkout' && 'Delivery & Payment'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close shopping bag"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#52665A] transition-colors hover:bg-[#E9E2D3] hover:text-[#173C2B] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {step === 'cart' && (
          <>
            {resolvedItems.length > 0 && (
              <div className="border-b border-[#173C2B]/10 bg-[#E9E2D3]/65 px-6 py-3">
                <p className="text-xs font-medium text-[#173C2B] tabular-nums">
                  {qualifiesFreeShipping
                    ? 'Complimentary Pan-India express shipping unlocked.'
                    : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for complimentary Pan-India shipping.`}
                </p>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#DDD2BF]">
                  <div
                    className="h-full bg-[#B69A61] transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {resolvedItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#173C2B]/12 bg-[#F8F5EC] text-[#987B43]">
                    <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <p className="mt-4 font-serif text-2xl font-medium text-[#173C2B]">
                    Your harvest bag is empty
                  </p>

                  <p className="mt-2 max-w-xs text-sm text-[#52665A]">
                    Explore Western Ghats spices, roasted coffee and botanical infusions selected from the
                    Western Ghats.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseShop();
                    }}
                    className="mt-6 inline-flex min-h-[44px] items-center rounded-md bg-[#173C2B] px-6 py-2.5 text-sm font-medium text-[#F3EBDD] transition-colors hover:bg-[#244B35] cursor-pointer"
                  >
                    Browse Retail Harvests
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#173C2B]/10">
                  {resolvedItems.map((entry) => (
                    <li
                      key={`${entry.productId}-${entry.packSize}`}
                      className="flex gap-4 py-4 first:pt-0"
                    >
                      <ProductImage
                        src={entry.product.image}
                        alt={entry.product.imageAlt}
                        title={entry.product.name}
                        className="h-20 w-24 shrink-0 rounded-md border border-[#173C2B]/10"
                        imgClassName={entry.product.imageClassName}
                      />

                      <div className="flex flex-1 flex-col min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-serif text-lg font-semibold leading-tight text-[#173C2B] truncate">
                              {entry.product.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#718276] tabular-nums">
                              {entry.packSize} Pack · ₹
                              {entry.unitPrice.toLocaleString('en-IN')}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onRemoveItem(entry.productId, entry.packSize)
                            }
                            aria-label={`Remove ${entry.product.name} ${entry.packSize}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded text-[#718276] transition-colors hover:bg-[#E9E2D3] hover:text-[#173C2B] cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-md border border-[#173C2B]/15 bg-[#F8F5EC]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(entry.productId, entry.packSize, -1)
                              }
                              aria-label={`Decrease quantity of ${entry.product.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center text-[#173C2B] hover:bg-[#E9E2D3] cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>

                            <span className="w-8 text-center text-xs font-semibold tabular-nums">
                              {entry.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(entry.productId, entry.packSize, 1)
                              }
                              aria-label={`Increase quantity of ${entry.product.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center text-[#173C2B] hover:bg-[#E9E2D3] cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#173C2B] tabular-nums">
                            ₹{entry.lineTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {resolvedItems.length > 0 && (
              <div className="border-t border-[#173C2B]/10 bg-[#F8F5EC] px-6 py-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#52665A]">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-[#173C2B]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#52665A]">
                    <span>Pan-India Express Shipping</span>
                    <span className="tabular-nums font-medium text-[#173C2B]">
                      {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-[#173C2B]/10 pt-2.5 text-base font-semibold text-[#173C2B]">
                    <span>Estimated Total</span>
                    <span className="tabular-nums">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center rounded-md bg-[#173C2B] px-6 py-3 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#244B35] cursor-pointer"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-2.5 text-center text-xs text-[#718276]">
                  Inclusive of GST · Choose your preferred payment method
                </p>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form
            onSubmit={handleCheckoutSubmit}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div className="rounded-md border border-[#173C2B]/10 bg-[#F8F5EC] p-4 text-sm">
                <div className="flex justify-between font-medium text-[#173C2B]">
                  <span className="tabular-nums">
                    {resolvedItems.reduce((sum, i) => sum + i.quantity, 0)} Harvest Pack(s)
                  </span>

                  <span className="tabular-nums font-semibold">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#718276]">
                  Dispatched within 24–48 hours from our Idukki curing house.
                </p>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-md border border-red-800/20 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-900"
                >
                  {formError}
                </p>
              )}

              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium text-[#52665A]"
                >
                  Full Name *
                </label>

                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 text-sm text-[#173C2B]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#52665A]"
                  >
                    Phone / WhatsApp *
                  </label>

                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 text-sm text-[#173C2B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-pincode"
                    className="block text-xs font-medium text-[#52665A]"
                  >
                    Postal Code (PIN) *
                  </label>

                  <input
                    id="checkout-pincode"
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="643212"
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 text-sm text-[#173C2B] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-medium text-[#52665A]"
                >
                  Email (for invoice &amp; tracking)
                </label>

                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 text-sm text-[#173C2B]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-[#52665A]"
                >
                  Delivery Address *
                </label>

                <textarea
                  id="checkout-address"
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Flat, Street, Landmark"
                  className="mt-1 w-full rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 py-2.5 text-sm text-[#173C2B]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-medium text-[#52665A]"
                >
                  City / Town *
                </label>

                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Gudalur"
                  className="mt-1 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F8F5EC] px-3.5 text-sm text-[#173C2B]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#52665A]">
                  Payment Method
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  {(['UPI / Cards', 'Cash on Delivery (COD)'] as PaymentMethod[]).map(
                    (method) => {
                      const selected = paymentMethod === method;

                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`min-h-[42px] rounded-md border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            selected
                              ? 'border-[#173C2B] bg-[#173C2B] text-[#F3EBDD]'
                              : 'border-[#173C2B]/15 bg-[#F8F5EC] text-[#52665A] hover:border-[#173C2B]/40'
                          }`}
                        >
                          {method}
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="mt-2 text-xs text-[#718276]">
                  {paymentMethod === 'UPI / Cards'
                    ? 'You will complete your payment securely through Razorpay.'
                    : 'Pay when your order is delivered.'}
                </p>
              </div>
            </div>

            <div className="border-t border-[#173C2B]/10 bg-[#F8F5EC] px-6 py-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-md bg-[#173C2B] px-6 py-3 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#244B35] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <span className="tabular-nums">
                  {isSubmitting
                    ? 'Submitting Order...'
                    : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
                </span>
              </button>
            </div>
          </form>
        )}

        {step === 'confirmed' && receipt && (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-8">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173C2B] text-[#D6BD83]">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>

              <p className="mt-5 text-xs font-medium text-[#987B43] tabular-nums">
                Order {receipt.orderId}
              </p>

              <h3 className="mt-1 font-serif text-3xl font-semibold text-[#173C2B]">
                Thank you, {receipt.customerName}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#52665A]">
                {receipt.paymentMethod === 'UPI / Cards'
                  ? 'Your payment has been verified and your order is confirmed.'
                  : 'Your order has been recorded. Please pay when it is delivered.'}
              </p>

              <div className="mt-6 space-y-3 rounded-lg border border-[#173C2B]/10 bg-[#F8F5EC] p-5 text-sm">
                <div>
                  <p className="text-xs text-[#718276]">Items</p>

                  <ul className="mt-1 space-y-1 text-[#173C2B]">
                    {receipt.itemSummary.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[#173C2B]/10 pt-3">
                  <div>
                    <p className="text-xs text-[#718276]">Total Payable</p>
                    <p className="font-semibold text-[#173C2B] tabular-nums">
                      ₹{receipt.totalInr.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#718276]">Payment Method</p>
                    <p className="font-medium text-[#173C2B]">
                      {receipt.paymentMethod}
                    </p>
                    <p className="text-xs text-[#987B43]">
                      {receipt.paymentMethod === 'UPI / Cards' ? 'Payment successful' : 'Pay on delivery'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#173C2B]/10 pt-3">
                  <p className="text-xs text-[#718276]">Delivering To</p>
                  <p className="mt-0.5 text-[#173C2B]">
                    {receipt.address}, {receipt.city}, PIN {receipt.pincode}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href={whatsappReceiptHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#244B35] px-5 py-3 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#173C2B]"
              >
                <MessageCircle className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
                <span>Get Dispatch Updates on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-[#173C2B]/20 px-5 py-2.5 text-sm font-medium text-[#173C2B] transition-colors hover:bg-[#E9E2D3] cursor-pointer"
              >
                Continue Exploring Zestora Hills
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

    try {
      const orderItems = resolvedItems.map((entry) => ({
        product_id: entry.product.supabaseId,
        pack_size: entry.packSize,
        quantity: entry.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: customerName.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          delivery_address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          payment_method: paymentMethod,
          items: orderItems,
        },
      });

      if (error) {
        throw new Error(error.message || 'Unable to submit your order.');
      }

      if (!data || !data.success || !data.order_id) {
        throw new Error(data?.error || 'Your order could not be created.');
      }

      const summaryLines = resolvedItems.map(
        (entry) =>
          `${entry.product.name} (${entry.packSize}) × ${entry.quantity}`
      );

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
    } catch (error) {
      console.error('Checkout error:', error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
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
      className="fixed inset-0 z-50 flex justify-end bg-[#0E2017]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
      onClick={handleCloseDrawer}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-[#F7F4EC] text-[#132A1E] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#132A1E]/10 px-6 py-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Return to shopping bag"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#4A5D52] hover:bg-[#EFEADF] hover:text-[#132A1E] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            <h2 className="font-serif text-2xl font-semibold text-[#132A1E]">
              {step === 'cart' && 'Shopping Bag'}
              {step === 'checkout' && 'Delivery & Payment'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close shopping bag"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#4A5D52] transition-colors hover:bg-[#EFEADF] hover:text-[#132A1E] cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {step === 'cart' && (
          <>
            {resolvedItems.length > 0 && (
              <div className="border-b border-[#132A1E]/10 bg-[#EFEADF]/65 px-6 py-3">
                <p className="text-xs font-medium text-[#132A1E] tabular-nums">
                  {qualifiesFreeShipping
                    ? 'Complimentary Pan-India express shipping unlocked.'
                    : `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for complimentary Pan-India shipping.`}
                </p>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E2DACB]">
                  <div
                    className="h-full bg-[#B88A3E] transition-all duration-200"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {resolvedItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#132A1E]/12 bg-[#FCFBF7] text-[#966D28]">
                    <ShoppingBag className="h-6 w-6" aria-hidden="true" />
                  </div>

                  <p className="mt-4 font-serif text-2xl font-medium text-[#132A1E]">
                    Your harvest bag is empty
                  </p>

                  <p className="mt-2 max-w-xs text-sm text-[#4A5D52]">
                    Explore Western Ghats spices, roasted coffee and botanical infusions selected from the
                    Western Ghats.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBrowseShop();
                    }}
                    className="mt-6 inline-flex min-h-[44px] items-center rounded-md bg-[#132A1E] px-6 py-2.5 text-sm font-medium text-[#F7F4EC] transition-colors hover:bg-[#1B3B2B] cursor-pointer"
                  >
                    Browse Retail Harvests
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#132A1E]/10">
                  {resolvedItems.map((entry) => (
                    <li
                      key={`${entry.productId}-${entry.packSize}`}
                      className="flex gap-4 py-4 first:pt-0"
                    >
                      <ProductImage
                        src={entry.product.image}
                        alt={entry.product.imageAlt}
                        title={entry.product.name}
                        className="h-20 w-24 shrink-0 rounded-md border border-[#132A1E]/10"
                        imgClassName={entry.product.imageClassName}
                      />

                      <div className="flex flex-1 flex-col min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-serif text-lg font-semibold leading-tight text-[#132A1E] truncate">
                              {entry.product.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#63756A] tabular-nums">
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
                            className="inline-flex h-8 w-8 items-center justify-center rounded text-[#63756A] transition-colors hover:bg-[#EFEADF] hover:text-[#132A1E] cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-md border border-[#132A1E]/15 bg-[#FCFBF7]">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity(entry.productId, entry.packSize, -1)
                              }
                              aria-label={`Decrease quantity of ${entry.product.name}`}
                              className="inline-flex h-8 w-8 items-center justify-center text-[#132A1E] hover:bg-[#EFEADF] cursor-pointer"
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
                              className="inline-flex h-8 w-8 items-center justify-center text-[#132A1E] hover:bg-[#EFEADF] cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="text-sm font-semibold text-[#132A1E] tabular-nums">
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
              <div className="border-t border-[#132A1E]/10 bg-[#FCFBF7] px-6 py-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#4A5D52]">
                    <span>Subtotal</span>
                    <span className="tabular-nums font-medium text-[#132A1E]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#4A5D52]">
                    <span>Pan-India Express Shipping</span>
                    <span className="tabular-nums font-medium text-[#132A1E]">
                      {shippingFee === 0 ? 'Complimentary' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-[#132A1E]/10 pt-2.5 text-base font-semibold text-[#132A1E]">
                    <span>Estimated Total</span>
                    <span className="tabular-nums">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center rounded-md bg-[#132A1E] px-6 py-3 text-sm font-semibold text-[#F7F4EC] transition-colors hover:bg-[#1B3B2B] cursor-pointer"
                >
                  Proceed to Checkout
                </button>

                <p className="mt-2.5 text-center text-xs text-[#63756A]">
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
              <div className="rounded-md border border-[#132A1E]/10 bg-[#FCFBF7] p-4 text-sm">
                <div className="flex justify-between font-medium text-[#132A1E]">
                  <span className="tabular-nums">
                    {resolvedItems.reduce((sum, i) => sum + i.quantity, 0)} Harvest Pack(s)
                  </span>

                  <span className="tabular-nums font-semibold">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#63756A]">
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
                  className="block text-xs font-medium text-[#4A5D52]"
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
                  className="mt-1 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#FCFBF7] px-3.5 text-sm text-[#132A1E]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-medium text-[#4A5D52]"
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
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#FCFBF7] px-3.5 text-sm text-[#132A1E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-pincode"
                    className="block text-xs font-medium text-[#4A5D52]"
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
                    className="mt-1 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#FCFBF7] px-3.5 text-sm text-[#132A1E] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-medium text-[#4A5D52]"
                >
                  Email (for invoice &amp; tracking)
                </label>

                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#FCFBF7] px-3.5 text-sm text-[#132A1E]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-medium text-[#4A5D52]"
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
                  className="mt-1 w-full rounded-md border border-[#132A1E]/15 bg-[#FCFBF7] px-3.5 py-2.5 text-sm text-[#132A1E]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-medium text-[#4A5D52]"
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
                  className="mt-1 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#FCFBF7] px-3.5 text-sm text-[#132A1E]"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-[#4A5D52]">
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
                              ? 'border-[#132A1E] bg-[#132A1E] text-[#F7F4EC]'
                              : 'border-[#132A1E]/15 bg-[#FCFBF7] text-[#4A5D52] hover:border-[#132A1E]/40'
                          }`}
                        >
                          {method}
                        </button>
                      );
                    }
                  )}
                </div>

                <p className="mt-2 text-xs text-[#63756A]">
                  Payment will remain pending until it is collected or confirmed.
                  Our team will contact you with payment instructions.
                </p>
              </div>
            </div>

            <div className="border-t border-[#132A1E]/10 bg-[#FCFBF7] px-6 py-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-md bg-[#132A1E] px-6 py-3 text-sm font-semibold text-[#F7F4EC] transition-colors hover:bg-[#1B3B2B] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#132A1E] text-[#D4AF6A]">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>

              <p className="mt-5 text-xs font-medium text-[#966D28] tabular-nums">
                Order {receipt.orderId}
              </p>

              <h3 className="mt-1 font-serif text-3xl font-semibold text-[#132A1E]">
                Thank you, {receipt.customerName}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[#4A5D52]">
                Your order has been successfully recorded. Our team will contact you
                regarding payment and dispatch.
              </p>

              <div className="mt-6 space-y-3 rounded-lg border border-[#132A1E]/10 bg-[#FCFBF7] p-5 text-sm">
                <div>
                  <p className="text-xs text-[#63756A]">Items</p>

                  <ul className="mt-1 space-y-1 text-[#132A1E]">
                    {receipt.itemSummary.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-[#132A1E]/10 pt-3">
                  <div>
                    <p className="text-xs text-[#63756A]">Total Payable</p>
                    <p className="font-semibold text-[#132A1E] tabular-nums">
                      ₹{receipt.totalInr.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[#63756A]">Payment Method</p>
                    <p className="font-medium text-[#132A1E]">
                      {receipt.paymentMethod}
                    </p>
                    <p className="text-xs text-[#966D28]">Payment pending</p>
                  </div>
                </div>

                <div className="border-t border-[#132A1E]/10 pt-3">
                  <p className="text-xs text-[#63756A]">Delivering To</p>
                  <p className="mt-0.5 text-[#132A1E]">
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
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-md bg-[#1B3B2B] px-5 py-3 text-sm font-semibold text-[#F7F4EC] transition-colors hover:bg-[#132A1E]"
              >
                <MessageCircle className="h-4 w-4 text-[#D4AF6A]" aria-hidden="true" />
                <span>Get Dispatch Updates on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-md border border-[#132A1E]/20 px-5 py-2.5 text-sm font-medium text-[#132A1E] transition-colors hover:bg-[#EFEADF] cursor-pointer"
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

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { BRAND_CONTACT, PRODUCTS } from '../data/products';
import { InquiryMode, QuotePrefill } from '../types';
import { isSupabaseConfigured, supabase } from '../supabase';

interface ContactQuotePageProps {
  prefill?: QuotePrefill | null;
}

const INQUIRY_MODES: InquiryMode[] = ['Retail & Gifting'];

const VOLUME_OPTIONS = [
  'Personal / Family Order',
  'Retail Order',
  'Corporate or Festive Gifting Enquiry',
];

const PACKAGING_OPTIONS = [
  'Retail Packs (50g / 100g / 200g / 500g)',
  'Gift Set / Custom Packaging',
];

export function ContactQuotePage({ prefill }: ContactQuotePageProps) {
  const [mode, setMode] = useState<InquiryMode>(prefill?.mode ?? 'Retail & Gifting');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [volume, setVolume] = useState(VOLUME_OPTIONS[1]);
  const [packaging, setPackaging] = useState(prefill?.packaging ?? PACKAGING_OPTIONS[0]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    prefill?.products ?? ['Black Pepper', 'Green Cardamom']
  );
  const [message, setMessage] = useState(prefill?.note ?? '');
  const [errorText, setErrorText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (!prefill) return;
    if (prefill.mode) setMode(prefill.mode);
    if (prefill.products && prefill.products.length > 0) setSelectedProducts(prefill.products);
    if (prefill.packaging) setPackaging(prefill.packaging);
    if (prefill.note) setMessage(prefill.note);
    setSubmittedRef(null);
  }, [prefill]);

  const toggleProduct = (productName: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((item) => item !== productName)
        : [...prev, productName]
    );
  };

  const dynamicWhatsAppHref = useMemo(() => {
    const productList =
      selectedProducts.length > 0 ? selectedProducts.join(', ') : 'Western Ghats spices, coffee & infused teas';
    const lines = [
      `Hello Zestora Hills (zestorahills.in),`,
      `Inquiry Type: ${mode}`,
      fullName.trim() ? `Name: ${fullName.trim()}` : null,
      company.trim() ? `Company: ${company.trim()}` : null,
      `Products: ${productList}`,
      `Order Type: ${volume}`,
      `Packaging: ${packaging}`,
      destination.trim() ? `Destination: ${destination.trim()}` : null,
      message.trim() ? `Notes: ${message.trim()}` : null,
    ].filter(Boolean);

    return `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  }, [mode, fullName, company, selectedProducts, volume, packaging, destination, message]);

  const directWhatsAppHref = `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    'Hello Zestora Hills! I would like to inquire about your spices, roasted coffee and infused teas.'
  )}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorText('Please enter your name, email address, and phone or WhatsApp number.');
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      setErrorText('The online enquiry form is being configured. Please use the WhatsApp button to send your enquiry.');
      return;
    }

    setErrorText('');
    setIsSubmitting(true);
    const refId = `ZH-Q-${window.crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    try {
      const { error } = await supabase.from('quote_requests').insert({
        reference_code: refId,
        full_name: fullName.trim(),
        company: company.trim() || null,
        email: email.trim(),
        phone: phone.trim(),
        destination: destination.trim() || null,
        inquiry_mode: mode,
        estimated_volume: volume,
        packaging,
        products: selectedProducts,
        message: message.trim() || null,
      });
      if (error) throw error;
      setSubmittedRef(refId);
    } catch {
      setErrorText('We could not save your enquiry just now. Please send it using the WhatsApp button instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F3EBDD]">
      {/* Header Band */}
      <section className="bg-[#173C2B] text-[#F3EBDD]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14 sm:py-16">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#D6BD83]">
              <span>Contact Zestora Hills</span>
              <span aria-hidden="true">·</span>
              <span>zestorahills.in</span>
              <span aria-hidden="true">·</span>
              <span>Response within 24 Hours</span>
            </div>
            <h1 className="mt-4 font-serif text-[clamp(2.25rem,4vw,3.6rem)] font-medium leading-[1.1] text-[#F3EBDD] text-balance">
              We would love to hear from you.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#E9E2D3]/82">
              For product questions, order assistance or gifting enquiries, please get in touch with our team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Split Content */}
      <section className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Direct WhatsApp & Desk Info */}
          <div className="space-y-6 lg:col-span-5">
            {/* Prominent Direct WhatsApp Inquiry Card */}
            <div className="rounded-lg bg-[#173C2B] p-7 text-[#F3EBDD]">
              <p className="text-xs font-medium text-[#D6BD83]">Customer Support</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-[#F3EBDD]">
                Direct WhatsApp Inquiry
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#E9E2D3]/82">
                Message us for product information, order assistance and availability.
              </p>

              <a
                href={directWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-md bg-[#D6BD83] px-6 py-3 text-sm font-semibold text-[#173C2B] transition-colors hover:bg-[#E5D19D]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span>Chat on WhatsApp ({BRAND_CONTACT.phoneDisplay})</span>
              </a>
              <p className="mt-3 text-xs text-[#E9E2D3]/65">
                {BRAND_CONTACT.hours} · Direct to Zestora Hills Desk
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="rounded-lg border border-[#173C2B]/12 bg-[#F8F5EC] p-7 space-y-5">
              <h3 className="font-serif text-2xl font-semibold text-[#173C2B]">
                Contact Details
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#987B43]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#173C2B]">Western Ghats Curing Facility</p>
                    <p className="mt-0.5 text-[#52665A]">{BRAND_CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#987B43]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#173C2B]">Email Desks</p>
                    <p className="mt-0.5 text-[#52665A]">
                      General Enquiries:{' '}
                      <a
                        href={`mailto:${BRAND_CONTACT.tradeEmail}`}
                        className="text-[#173C2B] underline decoration-[#B69A61]/60 underline-offset-4 hover:text-[#987B43]"
                      >
                        {BRAND_CONTACT.tradeEmail}
                      </a>
                    </p>
                    <p className="mt-0.5 text-[#52665A]">
                      Customer Care:{' '}
                      <a
                        href={`mailto:${BRAND_CONTACT.careEmail}`}
                        className="text-[#173C2B] underline decoration-[#B69A61]/60 underline-offset-4 hover:text-[#987B43]"
                      >
                        {BRAND_CONTACT.careEmail}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#987B43]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#173C2B]">Telephone</p>
                    <p className="mt-0.5 text-[#52665A] tabular-nums">
                      {BRAND_CONTACT.phoneDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Enquiry Form */}
          <div className="rounded-lg border border-[#173C2B]/12 bg-[#F8F5EC] p-6 sm:p-9 lg:col-span-7">
            {submittedRef ? (
              <div className="py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#173C2B] text-[#D6BD83]">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-medium text-[#987B43] tabular-nums">
                  Reference {submittedRef} · Received
                </p>
                <h2 className="mt-1 font-serif text-3xl font-semibold text-[#173C2B]">
                  Your inquiry has been logged
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[#52665A]">
                  Thank you, {fullName}. Our team will review your message and reply to <strong>{email}</strong> within
                  one business day.
                </p>

                <div className="mt-6 space-y-2 rounded-md border border-[#173C2B]/10 bg-[#F3EBDD] p-5 text-sm">
                  <p>
                    <span className="text-[#718276]">Inquiry Type:</span>{' '}
                    <span className="font-medium text-[#173C2B]">{mode}</span>
                  </p>
                  <p>
                    <span className="text-[#718276]">Harvests:</span>{' '}
                    <span className="font-medium text-[#173C2B]">
                      {selectedProducts.length > 0 ? selectedProducts.join(', ') : 'General Catalog'}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#718276]">Volume &amp; Pack:</span>{' '}
                    <span className="font-medium text-[#173C2B]">
                      {volume} · {packaging}
                    </span>
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={dynamicWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#173C2B] px-6 py-3 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#244B35]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
                    <span>Also Send Summary on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="inline-flex min-h-[46px] items-center rounded-md border border-[#173C2B]/20 px-5 py-3 text-sm font-medium text-[#173C2B] transition-colors hover:bg-[#E9E2D3] cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-[#173C2B]">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-sm text-[#52665A]">
                    Tell us what you are interested in and how we can help.
                  </p>
                </div>

                {/* Inquiry Mode Segmented Selector */}
                <div>
                  <p className="text-xs font-medium text-[#52665A]">Enquiry Type</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg bg-[#E9E2D3] p-1">
                    {INQUIRY_MODES.map((item) => {
                      const active = mode === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setMode(item)}
                          className={`min-h-[38px] flex-1 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? 'bg-[#173C2B] text-[#F3EBDD]'
                              : 'text-[#52665A] hover:text-[#173C2B]'
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorText && (
                  <p
                    role="alert"
                    className="rounded-md border border-red-800/20 bg-red-50 px-4 py-3 text-xs font-medium text-red-900"
                  >
                    {errorText}
                  </p>
                )}

                {/* Contact Fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="quote-name"
                      className="block text-xs font-medium text-[#52665A]"
                    >
                      Full Name *
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rohan Krishnan"
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3.5 text-sm text-[#173C2B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-company"
                      className="block text-xs font-medium text-[#52665A]"
                    >
                      Company / Hospitality / Roastery
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Malabar Provisions Pvt. Ltd."
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3.5 text-sm text-[#173C2B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="quote-email"
                      className="block text-xs font-medium text-[#52665A]"
                    >
                      Work or Personal Email *
                    </label>
                    <input
                      id="quote-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@company.com"
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3.5 text-sm text-[#173C2B]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-phone"
                      className="block text-xs font-medium text-[#52665A]"
                    >
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 / Country Code + Number"
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3.5 text-sm text-[#173C2B]"
                    />
                  </div>
                </div>

                {/* Product Selection Checkboxes */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-medium text-[#52665A]">
                      Products You Are Interested In ({selectedProducts.length} selected)
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedProducts(
                          selectedProducts.length === PRODUCTS.length
                            ? []
                            : PRODUCTS.map((p) => p.name)
                        )
                      }
                      className="text-xs font-medium text-[#987B43] hover:text-[#173C2B] cursor-pointer"
                    >
                      {selectedProducts.length === PRODUCTS.length ? 'Clear All' : 'Select All Products'}
                    </button>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {PRODUCTS.map((product) => {
                      const isChecked = selectedProducts.includes(product.name);
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => toggleProduct(product.name)}
                          aria-pressed={isChecked}
                          className={`flex min-h-[40px] items-center justify-between rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                            isChecked
                              ? 'border-[#173C2B] bg-[#173C2B] text-[#F3EBDD]'
                              : 'border-[#173C2B]/15 bg-[#F3EBDD]/60 text-[#173C2B] hover:border-[#173C2B]/40'
                          }`}
                        >
                          <span className="truncate">{product.name}</span>
                          {isChecked && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#D6BD83]" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Volume, Packaging & Destination */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="quote-volume"
                      className="block text-xs font-medium text-[#52665A]"
                    >
                      Estimated Volume
                    </label>
                    <select
                      id="quote-volume"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3 text-sm text-[#173C2B] cursor-pointer"
                    >
                      {VOLUME_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="quote-packaging"
                      className="block text-xs font-medium text-[#52665A]"
                    >
                      Packaging Preference
                    </label>
                    <select
                      id="quote-packaging"
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3 text-sm text-[#173C2B] cursor-pointer"
                    >
                      {PACKAGING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="quote-destination"
                    className="block text-xs font-medium text-[#52665A]"
                  >
                    Delivery City
                  </label>
                  <input
                    id="quote-destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Coimbatore, Chennai or Bengaluru"
                    className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3.5 text-sm text-[#173C2B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quote-message"
                    className="block text-xs font-medium text-[#52665A]"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="quote-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us which products you are interested in or ask us anything...​"
                    className="mt-1.5 w-full rounded-md border border-[#173C2B]/15 bg-[#F3EBDD]/50 px-3.5 py-2.5 text-sm text-[#173C2B]"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-md bg-[#173C2B] px-6 py-3 text-sm font-semibold text-[#F3EBDD] transition-colors hover:bg-[#244B35] whitespace-nowrap cursor-pointer"
                  >
                    <Send className="h-4 w-4 text-[#D6BD83]" aria-hidden="true" />
                    <span>{isSubmitting ? 'Submitting…' : 'Send Enquiry'}</span>
                  </button>

                  <a
                    href={dynamicWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-[#173C2B]/25 bg-[#F3EBDD] px-5 py-3 text-sm font-semibold text-[#173C2B] transition-colors hover:border-[#B69A61] hover:bg-[#E9E2D3] whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4 text-[#244B35]" aria-hidden="true" />
                    <span>Send via WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

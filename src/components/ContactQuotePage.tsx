import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { BRAND_CONTACT, PRODUCTS } from '../data/products';
import { InquiryMode, QuotePrefill } from '../types';

interface ContactQuotePageProps {
  prefill?: QuotePrefill | null;
}

const INQUIRY_MODES: InquiryMode[] = [
  'Bulk & Export Quote',
  'Domestic Wholesale',
  'Retail & Gifting',
];

const VOLUME_OPTIONS = [
  'Evaluation Sample Kit (100g × 6 SKUs)',
  '10 kg – 50 kg (Domestic Wholesale)',
  '50 kg – 250 kg (Air Freight / Regional Bulk)',
  '250 kg – 1,000 kg (Export Consolidated)',
  '1 MT+ / Full Container Load (FCL)',
  'Retail / Corporate Gifting Packs',
];

const PACKAGING_OPTIONS = [
  '5kg Vacuum Foil',
  '25kg Export Sack',
  '100g / 200g Retail Pouches',
  'Private Label / Custom Tins',
];

export function ContactQuotePage({ prefill }: ContactQuotePageProps) {
  const [mode, setMode] = useState<InquiryMode>(prefill?.mode ?? 'Bulk & Export Quote');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [volume, setVolume] = useState(VOLUME_OPTIONS[1]);
  const [packaging, setPackaging] = useState(prefill?.packaging ?? PACKAGING_OPTIONS[0]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    prefill?.products ?? ['Whole Black Pepper', 'Green Cardamom']
  );
  const [message, setMessage] = useState(prefill?.note ?? '');
  const [errorText, setErrorText] = useState('');
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
      selectedProducts.length > 0 ? selectedProducts.join(', ') : 'Single-Origin Spices & Coffee';
    const lines = [
      `Hello Zestora Hills (zestorahills.in),`,
      `Inquiry Type: ${mode}`,
      fullName.trim() ? `Name: ${fullName.trim()}` : null,
      company.trim() ? `Company: ${company.trim()}` : null,
      `Products: ${productList}`,
      `Estimated Volume: ${volume}`,
      `Packaging: ${packaging}`,
      destination.trim() ? `Destination: ${destination.trim()}` : null,
      message.trim() ? `Notes: ${message.trim()}` : null,
    ].filter(Boolean);

    return `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  }, [mode, fullName, company, selectedProducts, volume, packaging, destination, message]);

  const directWhatsAppHref = `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    'Hello Zestora Hills! I would like to inquire about single-origin Western Ghats spices and estate coffee (retail / bulk export).'
  )}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorText('Please enter your name, email address, and phone or WhatsApp number.');
      return;
    }
    setErrorText('');
    const refId = `ZH-Q-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(refId);
  };

  return (
    <div className="bg-[#F7F4EC]">
      {/* Header Band */}
      <section className="bg-[#132A1E] text-[#F7F4EC]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-14 sm:py-16">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide text-[#D4AF6A]">
              <span>Contact &amp; Bulk Trade Desk</span>
              <span aria-hidden="true">·</span>
              <span>zestorahills.in</span>
              <span aria-hidden="true">·</span>
              <span>Response within 24 Hours</span>
            </div>
            <h1 className="mt-4 font-serif text-[clamp(2.25rem,4vw,3.6rem)] font-medium leading-[1.1] text-[#F7F4EC] text-balance">
              Request a wholesale quotation or speak directly with our sourcing desk.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#EFEADF]/82">
              Whether you need 100g retail guidance, a 25kg domestic wholesale consignment, or FOB
              Cochin export pricing with FSSAI and Spices Board documentation, our team responds
              promptly.
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
            <div className="rounded-lg bg-[#132A1E] p-7 text-[#F7F4EC]">
              <p className="text-xs font-medium text-[#D4AF6A]">Instant Trade &amp; Retail Support</p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-[#F7F4EC]">
                Direct WhatsApp Inquiry
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#EFEADF]/82">
                Connect directly with our Idukki sourcing and export desk on WhatsApp for live crop
                availability, current harvest photos, sample dispatch, and urgent bulk quotes.
              </p>

              <a
                href={directWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-md bg-[#D4AF6A] px-6 py-3 text-sm font-semibold text-[#132A1E] transition-colors hover:bg-[#E5C88B]"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span>Chat on WhatsApp ({BRAND_CONTACT.phoneDisplay})</span>
              </a>
              <p className="mt-3 text-xs text-[#EFEADF]/65">
                {BRAND_CONTACT.hours} · Direct to Zestora Hills Desk
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="rounded-lg border border-[#132A1E]/12 bg-[#FCFBF7] p-7 space-y-5">
              <h3 className="font-serif text-2xl font-semibold text-[#132A1E]">
                Sourcing &amp; Dispatch House
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#966D28]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#132A1E]">Western Ghats Curing Facility</p>
                    <p className="mt-0.5 text-[#4A5D52]">{BRAND_CONTACT.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#966D28]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#132A1E]">Email Desks</p>
                    <p className="mt-0.5 text-[#4A5D52]">
                      Wholesale &amp; Export:{' '}
                      <a
                        href={`mailto:${BRAND_CONTACT.tradeEmail}`}
                        className="text-[#132A1E] underline decoration-[#B88A3E]/60 underline-offset-4 hover:text-[#966D28]"
                      >
                        {BRAND_CONTACT.tradeEmail}
                      </a>
                    </p>
                    <p className="mt-0.5 text-[#4A5D52]">
                      Retail Care:{' '}
                      <a
                        href={`mailto:${BRAND_CONTACT.careEmail}`}
                        className="text-[#132A1E] underline decoration-[#B88A3E]/60 underline-offset-4 hover:text-[#966D28]"
                      >
                        {BRAND_CONTACT.careEmail}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#966D28]" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[#132A1E]">Telephone</p>
                    <p className="mt-0.5 text-[#4A5D52] tabular-nums">
                      {BRAND_CONTACT.phoneDisplay}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact & Bulk Quote Form */}
          <div className="rounded-lg border border-[#132A1E]/12 bg-[#FCFBF7] p-6 sm:p-9 lg:col-span-7">
            {submittedRef ? (
              <div className="py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#132A1E] text-[#D4AF6A]">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-medium text-[#966D28] tabular-nums">
                  Reference {submittedRef} · Received
                </p>
                <h2 className="mt-1 font-serif text-3xl font-semibold text-[#132A1E]">
                  Your inquiry has been logged
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-[#4A5D52]">
                  Thank you, {fullName}. Our Western Ghats trade desk will prepare grade specs and
                  pricing for your selected harvests and reply to <strong>{email}</strong> within
                  one business day.
                </p>

                <div className="mt-6 space-y-2 rounded-md border border-[#132A1E]/10 bg-[#F7F4EC] p-5 text-sm">
                  <p>
                    <span className="text-[#63756A]">Inquiry Type:</span>{' '}
                    <span className="font-medium text-[#132A1E]">{mode}</span>
                  </p>
                  <p>
                    <span className="text-[#63756A]">Harvests:</span>{' '}
                    <span className="font-medium text-[#132A1E]">
                      {selectedProducts.length > 0 ? selectedProducts.join(', ') : 'General Catalog'}
                    </span>
                  </p>
                  <p>
                    <span className="text-[#63756A]">Volume &amp; Pack:</span>{' '}
                    <span className="font-medium text-[#132A1E]">
                      {volume} · {packaging}
                    </span>
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={dynamicWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-md bg-[#132A1E] px-6 py-3 text-sm font-semibold text-[#F7F4EC] transition-colors hover:bg-[#1B3B2B]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#D4AF6A]" aria-hidden="true" />
                    <span>Also Send Summary on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="inline-flex min-h-[46px] items-center rounded-md border border-[#132A1E]/20 px-5 py-3 text-sm font-medium text-[#132A1E] transition-colors hover:bg-[#EFEADF] cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-[#132A1E]">
                    Contact &amp; Bulk Quote Form
                  </h2>
                  <p className="mt-1 text-sm text-[#4A5D52]">
                    Select your inquiry type and target products for an itemized quotation.
                  </p>
                </div>

                {/* Inquiry Mode Segmented Selector */}
                <div>
                  <p className="text-xs font-medium text-[#4A5D52]">Inquiry Channel</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 rounded-lg bg-[#EFEADF] p-1">
                    {INQUIRY_MODES.map((item) => {
                      const active = mode === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setMode(item)}
                          className={`min-h-[38px] flex-1 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? 'bg-[#132A1E] text-[#F7F4EC]'
                              : 'text-[#4A5D52] hover:text-[#132A1E]'
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
                      className="block text-xs font-medium text-[#4A5D52]"
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
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3.5 text-sm text-[#132A1E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-company"
                      className="block text-xs font-medium text-[#4A5D52]"
                    >
                      Company / Hospitality / Roastery
                    </label>
                    <input
                      id="quote-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Malabar Provisions Pvt. Ltd."
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3.5 text-sm text-[#132A1E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="quote-email"
                      className="block text-xs font-medium text-[#4A5D52]"
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
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3.5 text-sm text-[#132A1E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quote-phone"
                      className="block text-xs font-medium text-[#4A5D52]"
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
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3.5 text-sm text-[#132A1E]"
                    />
                  </div>
                </div>

                {/* Product Selection Checkboxes */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-xs font-medium text-[#4A5D52]">
                      Harvests of Interest ({selectedProducts.length} selected)
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
                      className="text-xs font-medium text-[#966D28] hover:text-[#132A1E] cursor-pointer"
                    >
                      {selectedProducts.length === PRODUCTS.length ? 'Clear All' : 'Select All 10'}
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
                              ? 'border-[#132A1E] bg-[#132A1E] text-[#F7F4EC]'
                              : 'border-[#132A1E]/15 bg-[#F7F4EC]/60 text-[#132A1E] hover:border-[#132A1E]/40'
                          }`}
                        >
                          <span className="truncate">{product.name}</span>
                          {isChecked && (
                            <Check className="h-3.5 w-3.5 shrink-0 text-[#D4AF6A]" aria-hidden="true" />
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
                      className="block text-xs font-medium text-[#4A5D52]"
                    >
                      Estimated Volume
                    </label>
                    <select
                      id="quote-volume"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3 text-sm text-[#132A1E] cursor-pointer"
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
                      className="block text-xs font-medium text-[#4A5D52]"
                    >
                      Preferred Packaging
                    </label>
                    <select
                      id="quote-packaging"
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3 text-sm text-[#132A1E] cursor-pointer"
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
                    className="block text-xs font-medium text-[#4A5D52]"
                  >
                    Delivery City / Destination Port &amp; Country
                  </label>
                  <input
                    id="quote-destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Bengaluru (India), Dubai (Jebel Ali), or Rotterdam (EU)"
                    className="mt-1.5 min-h-[42px] w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3.5 text-sm text-[#132A1E]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="quote-message"
                    className="block text-xs font-medium text-[#4A5D52]"
                  >
                    Grade Requirements, Lab COA Needs, or Message
                  </label>
                  <textarea
                    id="quote-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify sieve grade (e.g. 8mm+ cardamom, TGSEB pepper), target Incoterms (FOB/CIF), or private-label pack details..."
                    className="mt-1.5 w-full rounded-md border border-[#132A1E]/15 bg-[#F7F4EC]/50 px-3.5 py-2.5 text-sm text-[#132A1E]"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    className="inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-md bg-[#132A1E] px-6 py-3 text-sm font-semibold text-[#F7F4EC] transition-colors hover:bg-[#1B3B2B] whitespace-nowrap cursor-pointer"
                  >
                    <Send className="h-4 w-4 text-[#D4AF6A]" aria-hidden="true" />
                    <span>Submit Quote Request</span>
                  </button>

                  <a
                    href={dynamicWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-md border border-[#132A1E]/25 bg-[#F7F4EC] px-5 py-3 text-sm font-semibold text-[#132A1E] transition-colors hover:border-[#B88A3E] hover:bg-[#EFEADF] whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4 text-[#1B3B2B]" aria-hidden="true" />
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

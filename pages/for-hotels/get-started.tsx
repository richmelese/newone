import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';

const services = [
  'Hotel',
  'Resort',
  'Lodge',
  'Guesthouse',
  'Boutique hotel',
  'Serviced apartment',
  'Spa & wellness',
  'Restaurant',
  'Bar / cafe',
  'Event & conference',
  'Tours & activities',
];

const amenities = [
  'Free Wi-Fi',
  'Parking',
  'Restaurant',
  'Swimming pool',
  'Airport shuttle',
  'Air conditioning',
  'Bar',
  'Gym',
  'Spa',
  'Breakfast',
  'Room service',
  'Pet friendly',
  '24h front desk',
  'Conference / events',
];

const cities = [
  'Addis Ababa',
  'Bahir Dar',
  'Gondar',
  'Lalibela',
  'Hawassa',
  'Mekelle',
  'Dire Dawa',
  'Adama',
  'Jimma',
  'Arba Minch',
  'Other',
];

const inputClasses =
  'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10';

const labelClasses = 'mb-1.5 block text-sm font-semibold text-ink-800';
const requiredMark = <span className="text-accent-500">*</span>;

function ChipGroup({ name, options }: { name: string; options: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((option) => (
        <label key={option} className="group relative cursor-pointer">
          <input type="checkbox" name={name} value={option} className="peer sr-only" />
          <span className="inline-flex rounded-pill border border-neutral-300 bg-white px-3.5 py-2 text-sm text-ink-800 transition peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:font-semibold peer-checked:text-primary-700 peer-focus-visible:ring-4 peer-focus-visible:ring-primary-600/15">
            {option}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function GetStartedPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [propertyName, setPropertyName] = useState('your property');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const submittedProperty = formData.get('propertyName')?.toString().trim();
    setPropertyName(submittedProperty || 'your property');
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout
      seo={{
        title: 'Request to list your property',
        description: 'Request an Ethiopidia listing or hotel website for your property.',
        path: '/for-hotels/get-started',
        noindex: true,
      }}
    >
      <PageShell className="py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navForHotels, href: '/for-hotels' },
            { label: 'Request to list your property' },
          ]}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <aside className="relative overflow-hidden rounded-[22px] bg-primary-gradient text-primary-50 shadow-card lg:sticky lg:top-24">
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(120px_120px_at_88%_12%,rgba(61,111,154,.9),transparent_60%),repeating-linear-gradient(45deg,rgba(255,255,255,.18)_0_2px,transparent_2px_16px)]" />
            <div className="relative p-8 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-100">For property owners</p>
              <h1 className="mt-3 font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Request to list your property
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-50/90">
                Get your hotel or lodge discovered on Ethiopidia and, when you are ready, a branded website with built-in booking.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  ['1', 'Send your request', 'Tell us about your property and what you would like.'],
                  ['2', 'We build and deploy', 'The I Hope team sets up your site from your chosen template.'],
                  ['3', 'Go live and get found', 'Manage everything from your dashboard and appear on the marketplace.'],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/30 bg-white/15 font-heading text-sm font-semibold text-white">
                      {number}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{title}</span>
                      <span className="mt-0.5 block text-sm text-primary-50/80">{description}</span>
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-7 border-t border-white/20 pt-5 text-sm leading-relaxed text-primary-50/85">
                <strong className="font-semibold text-white">No payment now.</strong> This is a request. Our team reviews it and follows up
                to complete onboarding. Booking and payment happen on your own hotel website.
              </p>
            </div>
          </aside>

          <section className="rounded-[22px] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
            {submitted ? (
              <div className="py-14 text-center" aria-live="polite">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-500/10 text-success-500">
                  <CheckCircle2 size={34} />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-bold text-ink-900">Request sent</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
                  Thanks. We have received your request to list <strong className="text-ink-800">{propertyName}</strong>.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
                  The I Hope team will review it and reach out to complete your onboarding and build your site.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="divide-y divide-neutral-200">
                <section className="pb-6">
                  <h2 className="font-heading text-lg font-bold text-ink-900">Your details</h2>
                  <p className="mt-1 text-sm text-ink-500">Who should we contact about this property?</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClasses}>
                        Full name {requiredMark}
                      </label>
                      <input id="name" name="name" type="text" required placeholder="e.g. Selam Bekele" className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="role" className={labelClasses}>
                        Role
                      </label>
                      <select id="role" name="role" className={inputClasses} defaultValue="">
                        <option value="">Select...</option>
                        <option>Owner</option>
                        <option>Manager</option>
                        <option>Staff</option>
                        <option>Agent / representative</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email {requiredMark}
                      </label>
                      <input id="email" name="email" type="email" required placeholder="you@example.com" className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClasses}>
                        Phone / WhatsApp {requiredMark}
                      </label>
                      <input id="phone" name="phone" type="tel" required placeholder="+251 ..." className={inputClasses} />
                    </div>
                  </div>
                </section>

                <section className="py-6">
                  <h2 className="font-heading text-lg font-bold text-ink-900">Property details</h2>
                  <p className="mt-1 text-sm text-ink-500">The basics travelers will see.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="propertyName" className={labelClasses}>
                        Property name {requiredMark}
                      </label>
                      <input
                        id="propertyName"
                        name="propertyName"
                        type="text"
                        required
                        placeholder="e.g. Blue Nile Resort"
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label htmlFor="type" className={labelClasses}>
                        Property type {requiredMark}
                      </label>
                      <select id="type" name="type" required className={inputClasses} defaultValue="">
                        <option value="">Select...</option>
                        <option>Hotel</option>
                        <option>Resort</option>
                        <option>Lodge</option>
                        <option>Guesthouse</option>
                        <option>Boutique hotel</option>
                        <option>Serviced apartment</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="stars" className={labelClasses}>
                        Star class <span className="font-normal text-ink-400">(optional)</span>
                      </label>
                      <select id="stars" name="stars" className={inputClasses} defaultValue="">
                        <option value="">Not rated</option>
                        <option>1 star</option>
                        <option>2 stars</option>
                        <option>3 stars</option>
                        <option>4 stars</option>
                        <option>5 stars</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rooms" className={labelClasses}>
                        Number of rooms <span className="font-normal text-ink-400">(approx.)</span>
                      </label>
                      <input id="rooms" name="rooms" type="number" min="1" placeholder="e.g. 24" className={inputClasses} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="description" className={labelClasses}>
                        Short description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="A sentence or two about your property, its style, and what makes it special."
                        className={inputClasses}
                      />
                    </div>
                  </div>
                </section>

                <section className="py-6">
                  <h2 className="font-heading text-lg font-bold text-ink-900">Location</h2>
                  <p className="mt-1 text-sm text-ink-500">Where is your property?</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className={labelClasses}>
                        City / region {requiredMark}
                      </label>
                      <select id="city" name="city" required className={inputClasses} defaultValue="">
                        <option value="">Select...</option>
                        {cities.map((city) => (
                          <option key={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="address" className={labelClasses}>
                        Address / area
                      </label>
                      <input id="address" name="address" type="text" placeholder="Sub-city, street, or landmark" className={inputClasses} />
                    </div>
                  </div>
                </section>

                <section className="py-6">
                  <h2 className="font-heading text-lg font-bold text-ink-900">Services & amenities</h2>
                  <p className="mt-1 text-sm text-ink-500">Tell travelers what your property offers.</p>
                  <div className="mt-4">
                    <span className={labelClasses}>
                      Services offered <span className="font-normal text-ink-400">(select all that apply)</span>
                    </span>
                    <ChipGroup name="services" options={services} />
                  </div>
                  <div className="mt-5">
                    <span className={labelClasses}>Amenities</span>
                    <ChipGroup name="amenities" options={amenities} />
                  </div>
                </section>

                <section className="py-6">
                  <h2 className="font-heading text-lg font-bold text-ink-900">
                    Photos & logo <span className="font-sans text-sm font-normal text-ink-400">(optional)</span>
                  </h2>
                  <p className="mt-1 text-sm text-ink-500">Add a few now, or send them later during onboarding.</p>
                  <input
                    type="file"
                    name="media"
                    accept="image/*"
                    multiple
                    className="mt-4 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-ink-700 file:mr-4 file:rounded-pill file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700"
                  />
                </section>

                <section className="py-6">
                  <h2 className="font-heading text-lg font-bold text-ink-900">Anything else?</h2>
                  <textarea
                    name="notes"
                    rows={4}
                    placeholder="Questions, timing, or anything we should know."
                    className={`${inputClasses} mt-4`}
                  />
                  <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-ink-500">
                    <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-primary-600" />I agree to be contacted
                    by the Ethiopidia / I Hope team about this request. {requiredMark}
                  </label>
                </section>

                <div className="flex flex-wrap items-center gap-4 pt-6">
                  <Button type="submit" size="lg">
                    Send request
                  </Button>
                  <span className="text-sm text-ink-500">Takes about 2 minutes - No payment required</span>
                </div>
              </form>
            )}
          </section>
        </div>
      </PageShell>
    </Layout>
  );
}

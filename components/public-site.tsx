"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  Menu,
  X,
  Plus,
  Minus,
  Sparkles,
  Heart,
  Star,
} from "lucide-react";
import {
  whatsappLink,
  type ContentItem,
  type Settings,
} from "@/lib/validation";

function Instagram({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}
type Props = {
  settings: Settings;
  packages: ContentItem[];
  portfolio: ContentItem[];
  beforeAfter: ContentItem[];
  testimonials: ContentItem[];
  faqs: ContentItem[];
};
function Booking({
  number,
  name,
  light = false,
}: {
  number: string;
  name?: string;
  light?: boolean;
}) {
  const href = whatsappLink(number, name);
  return href ? (
    <a
      className={`button ${light ? "button-light" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name ? "Book This Look" : "Book on WhatsApp"} <ArrowUpRight size={17} />
    </a>
  ) : (
    <a className="button button-inquiry" href="#contact">
      Enquire about your look <ArrowUpRight size={17} />
    </a>
  );
}
function Comparison({ item }: { item: ContentItem }) {
  const [position, setPosition] = useState(50);
  return (
    <article>
      <div className="comparison">
        <Image
          src={String(item.afterImage)}
          alt={`${item.title}, after makeup`}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
        />
        <div
          className="before-layer"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={String(item.beforeImage)}
            alt={`${item.title}, before makeup`}
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
        <span className="compare-label left">BEFORE</span>
        <span className="compare-label right">AFTER</span>
        <div className="compare-line" style={{ left: `${position}%` }}>
          <span>↔</span>
        </div>
        <input
          aria-label={`Compare before and after: ${item.title}`}
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </article>
  );
}
export function PublicSite({
  settings: s,
  packages,
  portfolio,
  beforeAfter,
  testimonials,
  faqs,
}: Props) {
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState("All"),
    [selected, setSelected] = useState<ContentItem | null>(null),
    [galleryImage, setGalleryImage] = useState<ContentItem | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    lightbox = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".public-site .section")
      .forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const categories = [
    "All",
    ...new Set(portfolio.map((p) => String(p.category)).filter(Boolean)),
  ];
  const social = [
    { label: "Instagram", url: s.instagramUrl, Icon: Instagram },
    {
      label: "WhatsApp",
      url: whatsappLink(s.whatsapp) || "",
      Icon: MessageCircle,
    },
    { label: "Get Directions", url: s.mapsUrl, Icon: MapPin },
  ].filter((x) => x.url);
  return (
    <div className="public-site">
      <header className="site-header">
        <a className="brand-logo-link" href="#" aria-label={`${s.businessName} home`}>
          <Image
            src="/makeup-by-dima-mark.svg"
            alt=""
            width={58}
            height={59}
            priority
            unoptimized
          />
          <span className="brand-logo-copy">
            <strong>{s.businessName}</strong>
            <small>MAKEUP ARTISTRY</small>
          </span>
        </a>
        <nav
          className={menu ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          {[
            ...(packages.length ? [["Packages", "#packages"]] : []),
            ...(portfolio.length ? [["Portfolio", "#portfolio"]] : []),
            ...(beforeAfter.length
              ? [["Before & After", "#before-after"]]
              : []),
            ...(faqs.length ? [["FAQ", "#faq"]] : []),
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenu(false)}>
              {label === "Get Directions" ? "Location" : label}
            </a>
          ))}
        </nav>
        <a
          href={whatsappLink(s.whatsapp) || "#contact"}
          className="header-book"
        >
          Book Now <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section className="hero">
          <div className="hero-aura" aria-hidden="true">
            <div className="gold-orbit orbit-one" />
            <div className="gold-orbit orbit-two" />
            <span className="aura-star">&#10023;</span>
          </div>
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> MAKEUP ARTIST &middot; BEAUTY &middot; BRIDAL
            </p>
            <h1>
              {s.heroHeadline === "Your beauty,\nbeautifully enhanced." ||
              !s.heroHeadline ? (
                <>
                  Beauty,
                  <br />
                  <span>Defined by You.</span>
                </>
              ) : (
                s.heroHeadline
                  .split("\n")
                  .map((line, i) => <span key={i}>{line}</span>)
              )}
            </h1>
            <p className="hero-description">
              {s.heroDescription ===
              "From the softest glow to your most unforgettable day. Makeup that feels like you, with a little extra magic."
                ? "Soft glam, bridal looks, and timeless makeup tailored to you."
                : s.heroDescription}
            </p>
            <div className="hero-actions">
              <a
                className="button"
                href={packages.length ? "#packages" : "#contact"}
              >
                {packages.length ? "Explore Packages" : "Find Your Look"}{" "}
                <ArrowUpRight size={18} />
              </a>
              {s.whatsapp && (
                <a
                  className="button button-outline"
                  href={whatsappLink(s.whatsapp)!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} /> Book on WhatsApp
                </a>
              )}
            </div>
            <div className="hero-signature">
              <span className="signature-line" />
              <span>YOUR FEATURES. YOUR STYLE. YOUR MOMENT.</span>
            </div>
          </div>
        </section>
        <div className="signature-strip">
          <span>SOFT GLAM</span>
          <i>&#10023;</i>
          <span>EFFORTLESS BEAUTY</span>
          <i>&#10023;</i>
          <span>BRIDAL ARTISTRY</span>
          <i>&#10023;</i>
          <span>UNMISTAKABLY YOU</span>
        </div>
        {packages.length > 0 && (
          <section id="packages" className="section packages-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE MAKEUP MENU</p>
                <h2>
                  A look for <em>every occasion.</em>
                </h2>
              </div>
              <p>
                Thoughtful details. Beautiful finishes.
                <br />
                Find the look that feels like you.
              </p>
            </div>
            <div className="package-grid">
              {packages.map((p, i) => (
                <article
                  className={`package-card ${i === 3 ? "featured" : ""}`}
                  key={p._id}
                >
                  {i === 3 && (
                    <span className="card-ribbon">YOUR MOST SPECIAL DAY</span>
                  )}
                  <div className="package-top">
                    <span className="package-index">0{i + 1}</span>
                    {i === 3 ? <Heart size={21} /> : <Sparkles size={21} />}
                  </div>
                  {p.image && (
                    <div className="package-image">
                      <Image
                        src={String(p.image)}
                        alt={String(p.name)}
                        fill
                        sizes="300px"
                      />
                    </div>
                  )}
                  <h3>
                    <button
                      className="title-button"
                      onClick={() => {
                        setSelected(p);
                        dialog.current?.showModal();
                      }}
                    >
                      {p.name}
                    </button>
                  </h3>
                  <p>{p.description}</p>
                  <div className="price">
                    ${p.price}
                    <span> / session</span>
                  </div>
                  <button
                    className="package-details"
                    onClick={() => {
                      setSelected(p);
                      dialog.current?.showModal();
                    }}
                  >
                    View Details <ArrowUpRight size={17} />
                  </button>
                  <Booking
                    number={s.whatsapp}
                    name={String(p.name)}
                    light={i === 3}
                  />
                </article>
              ))}
            </div>
            <p className="package-footnote">
              A little unsure which look is yours?{" "}
              <a href={whatsappLink(s.whatsapp) || "#contact"}>
                Let’s find it together <ArrowUpRight size={13} />
              </a>
            </p>
          </section>
        )}
        {portfolio.length > 0 && (
          <section id="portfolio" className="section portfolio-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">A CLOSER LOOK</p>
                <h2>
                  Beauty in <em>the details.</em>
                </h2>
              </div>
              {s.instagramUrl && (
                <a
                  className="text-link"
                  href={s.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={17} /> Follow the artistry{" "}
                  <ArrowUpRight size={15} />
                </a>
              )}
            </div>

            <>
              <div className="filters" aria-label="Filter portfolio">
                {categories.map((c) => (
                  <button
                    key={c}
                    className={category === c ? "selected" : ""}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="gallery-grid">
                {portfolio
                  .filter((p) => category === "All" || p.category === category)
                  .map((p) => (
                    <button
                      className="gallery-item"
                      key={p._id}
                      onClick={() => {
                        setGalleryImage(p);
                        lightbox.current?.showModal();
                      }}
                    >
                      <Image
                        src={String(p.image)}
                        alt={String(p.title)}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                      />
                      <span>
                        <span>
                          <small className="gallery-category">
                            {p.category}
                          </small>
                          {p.title}
                        </span>
                        <ArrowUpRight size={18} />
                      </span>
                    </button>
                  ))}
              </div>
            </>
          </section>
        )}
        {beforeAfter.length > 0 && (
          <section className="section before-section" id="before-after">
            <div className="section-heading">
              <div>
                <p className="eyebrow">THE FINISHING TOUCH</p>
                <h2>
                  A little artistry.<em> A beautiful difference.</em>
                </h2>
              </div>
              <p>Slide to discover the transformation.</p>
            </div>
            <div className="comparison-grid">
              {beforeAfter.map((item) => (
                <Comparison item={item} key={item._id} />
              ))}
            </div>
          </section>
        )}
        {testimonials.length > 0 && (
          <section className="section testimonials">
            <p className="eyebrow">LOVE NOTES</p>
            <h2>
              Beautiful looks. <em>Even better feelings.</em>
            </h2>
            <div className="testimonial-grid">
              {testimonials.map((t) => (
                <article key={t._id}>
                  {t.rating && (
                    <div
                      className="stars"
                      aria-label={`${t.rating} out of 5 stars`}
                    >
                      {Array.from({ length: Number(t.rating) }, (_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>
                  )}
                  <blockquote>“{t.review}”</blockquote>
                  <div className="review-author">
                    {t.image && (
                      <Image
                        src={String(t.image)}
                        alt={String(t.name)}
                        width={40}
                        height={40}
                      />
                    )}
                    <span>{t.name}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {faqs.length > 0 && (
          <section className="section faq-section" id="faq">
            <div>
              <p className="eyebrow">A FEW LITTLE DETAILS</p>
              <h2>
                Before your
                <br />
                <em>beauty moment.</em>
              </h2>
            </div>
            <div className="faqs">
              {faqs.map((f) => (
                <details key={f._id}>
                  <summary>
                    {f.question}
                    <Plus size={18} className="plus" />
                    <Minus size={18} className="minus" />
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        <section id="contact" className="contact-section">
          <span className="contact-sparkle">✧</span>
          <p className="eyebrow">LET’S MAKE IT YOUR MOMENT</p>
          <h2>
            Ready for <em>your look?</em>
          </h2>
          <p>
            A special occasion or a little just-because glam.
            <br />
            I’d love to create something beautiful with you.
          </p>
          {s.whatsapp && <Booking number={s.whatsapp} />}
          <div className="contact-links">
            {social.map(({ label, url, Icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={17} />
                {label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </section>
      </main>
      <footer>
        <a
          href="#"
          className="footer-brand-logo"
          aria-label={`${s.businessName} home`}
        >
          <Image
            src="/makeup-by-dima-logo.svg"
            alt={`${s.businessName} logo`}
            width={130}
            height={123}
            unoptimized
          />
        </a>
        <div className="footer-social">
          {social.map(({ label, url }) => (
            <a href={url} key={label} target="_blank" rel="noopener noreferrer">
              {label === "Get Directions" ? "Location" : label}
            </a>
          ))}
        </div>
        <p>
          Made by{" "}
          {s.footerUrl ? (
            <a href={s.footerUrl} target="_blank" rel="noopener noreferrer">
              Marwanweb.dev <ArrowUpRight size={11} />
            </a>
          ) : (
            <span>Marwanweb.dev</span>
          )}
        </p>
      </footer>
      <dialog
        aria-label="Package details"
        ref={dialog}
        className="package-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close package details"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {selected && (
          <>
            <p className="eyebrow">YOUR BEAUTY MOMENT</p>
            <h2>{selected.name}</h2>
            <p className="dialog-price">${selected.price}</p>
            <p>{selected.details}</p>
            {Array.isArray(selected.included) && (
              <ul>
                {selected.included.map((x) => (
                  <li key={x}>
                    <Check size={16} />
                    {x}
                  </li>
                ))}
              </ul>
            )}
            <Booking number={s.whatsapp} name={String(selected.name)} />
          </>
        )}
      </dialog>
      <dialog
        aria-label="Portfolio image"
        ref={lightbox}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) lightbox.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label="Close image"
          onClick={() => lightbox.current?.close()}
        >
          <X />
        </button>
        {galleryImage && (
          <>
            <div className="lightbox-image">
              <Image
                src={String(galleryImage.image)}
                alt={String(galleryImage.title)}
                fill
                sizes="90vw"
              />
            </div>
            <p>{galleryImage.title}</p>
          </>
        )}
      </dialog>
    </div>
  );
}

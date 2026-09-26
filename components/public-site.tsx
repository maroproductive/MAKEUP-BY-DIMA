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
import { localized, localizedList, ui, type Lang } from "@/lib/i18n";

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
  price,
  language = "en",
  light = false,
}: {
  number: string;
  name?: string;
  price?: number | string;
  language?: Lang;
  light?: boolean;
}) {
  const href = whatsappLink(number, name, price, language);
  const t = ui[language];
  return href ? (
    <a
      className={`button ${light ? "button-light" : ""}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name ? t.bookThisLook : t.bookWhatsapp} <ArrowUpRight size={17} />
    </a>
  ) : (
    <a className="button button-inquiry" href="#contact">
      {t.inquiry} <ArrowUpRight size={17} />
    </a>
  );
}
function Comparison({ item, lang }: { item: ContentItem; lang: Lang }) {
  const [position, setPosition] = useState(50);
  return (
    <article>
      <div className="comparison">
        <Image
          src={String(item.afterImage)}
          alt={`${localized(item, "title", lang)}, ${ui[lang].after}`}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
        />
        <div
          className="before-layer"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={String(item.beforeImage)}
            alt={`${localized(item, "title", lang)}, ${ui[lang].before}`}
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
        <span className="compare-label left">{ui[lang].before}</span>
        <span className="compare-label right">{ui[lang].after}</span>
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
      <h3>{localized(item, "title", lang)}</h3>
      <p>{localized(item, "description", lang)}</p>
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
    [galleryImage, setGalleryImage] = useState<ContentItem | null>(null),
    [lang, setLang] = useState<Lang>("en"),
    [languageReady, setLanguageReady] = useState(false);
  const t = ui[lang];
  const displayBusinessName =
    lang === "ar" && s.businessNameAr ? s.businessNameAr : s.businessName;
  const dialog = useRef<HTMLDialogElement>(null),
    lightbox = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const saved = window.localStorage.getItem("makeup-by-dima-language");
    const preferred: Lang =
      saved === "ar" || saved === "en"
        ? saved
        : navigator.language.toLowerCase().startsWith("ar")
          ? "ar"
          : "en";
    setLang(preferred);
    setLanguageReady(true);
  }, []);
  useEffect(() => {
    if (!languageReady) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("makeup-by-dima-language", lang);
  }, [lang, languageReady]);
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
  const categoryLabel = (value: string) => {
    if (value === "All") return t.all;
    const match = portfolio.find((p) => String(p.category) === value);
    return match ? localized(match, "category", lang) || value : value;
  };
  const social = [
    { label: t.instagram, url: s.instagramUrl, Icon: Instagram },
    {
      label: t.whatsapp,
      url: whatsappLink(s.whatsapp, undefined, undefined, lang) || "",
      Icon: MessageCircle,
    },
    { label: t.directions, url: s.mapsUrl, Icon: MapPin },
  ].filter((x) => x.url);
  return (
    <div className="public-site" lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="site-header">
        <a className="brand-logo-link" href="#" aria-label={`${displayBusinessName} home`}>
          <Image
            src="/makeup-by-dima-mark.svg"
            alt=""
            width={58}
            height={59}
            priority
            unoptimized
          />
          <span className="brand-logo-copy">
            <strong>{displayBusinessName}</strong>
            <small>{t.makeupArtistry}</small>
          </span>
        </a>
        <nav
          className={menu ? "navigation open" : "navigation"}
          aria-label="Main navigation"
        >
          {[
            ...(packages.length ? [[t.packages, "#packages"]] : []),
            ...(portfolio.length ? [[t.portfolio, "#portfolio"]] : []),
            ...(beforeAfter.length ? [[t.beforeAfter, "#before-after"]] : []),
            ...(faqs.length ? [[t.faq, "#faq"]] : []),
            [t.contact, "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenu(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a
          href={whatsappLink(s.whatsapp, undefined, undefined, lang) || "#contact"}
          className="header-book"
        >
          {t.bookNow} <ArrowUpRight size={15} />
        </a>
        <button
          className="language-toggle"
          type="button"
          aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
        >
          {lang === "en" ? "العربية" : "EN"}
        </button>
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
              <span /> {t.heroEyebrow}
            </p>
            <h1>
              {(lang === "ar" && s.heroHeadlineAr
                ? s.heroHeadlineAr
                : s.heroHeadline
              )
                .split("\n")
                .map((line, i) => <span key={i}>{line}</span>)}
            </h1>
            <p className="hero-description">
              {lang === "ar" && s.heroDescriptionAr
                ? s.heroDescriptionAr
                : s.heroDescription}
            </p>
            <div className="hero-actions">
              <a
                className="button"
                href={packages.length ? "#packages" : "#contact"}
              >
                {packages.length ? t.explorePackages : t.findYourLook}{" "}
                <ArrowUpRight size={18} />
              </a>
              {s.whatsapp && (
                <a
                  className="button button-outline"
                  href={whatsappLink(s.whatsapp, undefined, undefined, lang)!}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={17} /> {t.bookWhatsapp}
                </a>
              )}
            </div>
            <div className="hero-signature">
              <span className="signature-line" />
              <span>{t.signature}</span>
            </div>
          </div>
        </section>
        <div className="signature-strip">
          <span>{t.softGlam}</span>
          <i>&#10023;</i>
          <span>{t.effortlessBeauty}</span>
          <i>&#10023;</i>
          <span>{t.bridalArtistry}</span>
          <i>&#10023;</i>
          <span>{t.unmistakablyYou}</span>
        </div>
        {packages.length > 0 && (
          <section id="packages" className="section packages-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.menuEyebrow}</p>
                <h2>{t.menuTitle}</h2>
              </div>
              <p>{t.menuText}</p>
            </div>
            <div className="package-grid">
              {packages.map((p, i) => (
                <article
                  className={`package-card ${i === 3 ? "featured" : ""}`}
                  key={p._id}
                >
                  {i === 3 && (
                    <span className="card-ribbon">{t.specialDay}</span>
                  )}
                  <div className="package-top">
                    <span className="package-index">0{i + 1}</span>
                    {i === 3 ? <Heart size={21} /> : <Sparkles size={21} />}
                  </div>
                  {p.image && (
                    <div className="package-image">
                      <Image
                        src={String(p.image)}
                        alt={localized(p, "name", lang)}
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
                      {localized(p, "name", lang)}
                    </button>
                  </h3>
                  <p>{localized(p, "description", lang)}</p>
                  <div className="price">
                    ${p.price}
                    <span> {t.session}</span>
                  </div>
                  <button
                    className="package-details"
                    onClick={() => {
                      setSelected(p);
                      dialog.current?.showModal();
                    }}
                  >
                    {t.viewDetails} <ArrowUpRight size={17} />
                  </button>
                  <Booking
                    number={s.whatsapp}
                    name={localized(p, "name", lang)}
                    price={String(p.price)}
                    language={lang}
                    light={i === 3}
                  />
                </article>
              ))}
            </div>
            <p className="package-footnote">
              {t.unsure}{" "}
              <a href={whatsappLink(s.whatsapp, undefined, undefined, lang) || "#contact"}>
                {t.findTogether} <ArrowUpRight size={13} />
              </a>
            </p>
          </section>
        )}
        {portfolio.length > 0 && (
          <section id="portfolio" className="section portfolio-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.closerLook}</p>
                <h2>{t.beautyDetails}</h2>
              </div>
              {s.instagramUrl && (
                <a
                  className="text-link"
                  href={s.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram size={17} /> {t.followArtistry}{" "}
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
                    {categoryLabel(c)}
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
                        alt={localized(p, "title", lang)}
                        fill
                        sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                      />
                      <span>
                        <span>
                          <small className="gallery-category">
                            {localized(p, "category", lang) || String(p.category)}
                          </small>
                          {localized(p, "title", lang)}
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
                <p className="eyebrow">{t.finishingTouch}</p>
                <h2>{t.beforeTitle}</h2>
              </div>
              <p>{t.slideDiscover}</p>
            </div>
            <div className="comparison-grid">
              {beforeAfter.map((item) => (
                <Comparison item={item} lang={lang} key={item._id} />
              ))}
            </div>
          </section>
        )}
        {testimonials.length > 0 && (
          <section className="section testimonials">
            <p className="eyebrow">{t.loveNotes}</p>
            <h2>{t.testimonialTitle}</h2>
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
                  <blockquote>“{localized(t, "review", lang)}”</blockquote>
                  <div className="review-author">
                    {t.image && (
                      <Image
                        src={String(t.image)}
                        alt={localized(t, "name", lang)}
                        width={40}
                        height={40}
                      />
                    )}
                    <span>{localized(t, "name", lang)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
        {faqs.length > 0 && (
          <section className="section faq-section" id="faq">
            <div>
              <p className="eyebrow">{t.fewDetails}</p>
              <h2>{t.faqTitle}</h2>
            </div>
            <div className="faqs">
              {faqs.map((f) => (
                <details key={f._id}>
                  <summary>
                    {localized(f, "question", lang)}
                    <Plus size={18} className="plus" />
                    <Minus size={18} className="minus" />
                  </summary>
                  <p>{localized(f, "answer", lang)}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        <section id="contact" className="contact-section">
          <span className="contact-sparkle">✧</span>
          <p className="eyebrow">{t.contactEyebrow}</p>
          <h2>{t.ready}</h2>
          <p>{t.contactText}</p>
          {s.whatsapp && <Booking number={s.whatsapp} language={lang} />}
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
          aria-label={`${displayBusinessName} home`}
        >
          <Image
            src="/makeup-by-dima-logo.svg"
            alt={`${displayBusinessName} logo`}
            width={130}
            height={123}
            unoptimized
          />
        </a>
        <div className="footer-social">
          {social.map(({ label, url }) => (
            <a href={url} key={label} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ))}
        </div>
        <p>
          {t.madeBy}{" "}
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
        aria-label={t.closePackage}
        ref={dialog}
        className="package-dialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label={t.closePackage}
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {selected && (
          <>
            <p className="eyebrow">{t.beautyMoment}</p>
            <h2>{localized(selected, "name", lang)}</h2>
            <p className="dialog-price">${selected.price}</p>
            <p>{localized(selected, "details", lang)}</p>
            {localizedList(selected, "included", lang).length > 0 && (
              <ul>
                {localizedList(selected, "included", lang).map((x) => (
                  <li key={x}>
                    <Check size={16} />
                    {x}
                  </li>
                ))}
              </ul>
            )}
            <Booking
              number={s.whatsapp}
              name={localized(selected, "name", lang)}
              price={String(selected.price)}
              language={lang}
            />
          </>
        )}
      </dialog>
      <dialog
        aria-label={t.closeImage}
        ref={lightbox}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) lightbox.current?.close();
        }}
      >
        <button
          className="dialog-close"
          aria-label={t.closeImage}
          onClick={() => lightbox.current?.close()}
        >
          <X />
        </button>
        {galleryImage && (
          <>
            <div className="lightbox-image">
              <Image
                src={String(galleryImage.image)}
                alt={localized(galleryImage, "title", lang)}
                fill
                sizes="90vw"
              />
            </div>
            <p>{localized(galleryImage, "title", lang)}</p>
          </>
        )}
      </dialog>
    </div>
  );
}

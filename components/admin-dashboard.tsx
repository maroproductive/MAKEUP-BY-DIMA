"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  LogOut,
  Check,
} from "lucide-react";
import type { Collection } from "@/lib/validation";
type RecordData = Record<string, unknown>;
type Data = Record<string, RecordData[] | RecordData>;
type Field = { key: string; label: string; type?: string };
const sections: Record<Collection, string> = {
  packages: "Packages",
  portfolio: "Portfolio",
  beforeAfter: "Before & After",
  testimonials: "Testimonials",
  faqs: "FAQ",
  settings: "Site settings",
};
const fields: Record<Collection, Field[]> = {
  packages: [
    { key: "name", label: "Name (English)" },
    { key: "nameAr", label: "Name (Arabic)" },
    { key: "price", label: "Price (USD)", type: "number" },
    { key: "description", label: "Short description (English)", type: "textarea" },
    { key: "descriptionAr", label: "Short description (Arabic)", type: "textarea" },
    { key: "details", label: "Full details (English)", type: "textarea" },
    { key: "detailsAr", label: "Full details (Arabic)", type: "textarea" },
    {
      key: "included",
      label: "Included features (English, one per line)",
      type: "list",
    },
    {
      key: "includedAr",
      label: "Included features (Arabic, one per line)",
      type: "list",
    },
    { key: "image", label: "Image", type: "image" },
  ],
  portfolio: [
    { key: "title", label: "Title (English)" },
    { key: "titleAr", label: "Title (Arabic)" },
    { key: "category", label: "Category (English)" },
    { key: "categoryAr", label: "Category (Arabic)" },
    { key: "image", label: "Image", type: "image" },
  ],
  beforeAfter: [
    { key: "title", label: "Title (English)" },
    { key: "titleAr", label: "Title (Arabic)" },
    { key: "description", label: "Description (English)", type: "textarea" },
    { key: "descriptionAr", label: "Description (Arabic)", type: "textarea" },
    { key: "beforeImage", label: "Before image", type: "image" },
    { key: "afterImage", label: "After image", type: "image" },
  ],
  testimonials: [
    { key: "name", label: "Customer name (English)" },
    { key: "nameAr", label: "Customer name (Arabic)" },
    { key: "review", label: "Review (English)", type: "textarea" },
    { key: "reviewAr", label: "Review (Arabic)", type: "textarea" },
    { key: "rating", label: "Rating (1–5, optional)", type: "number" },
    { key: "image", label: "Customer image", type: "image" },
  ],
  faqs: [
    { key: "question", label: "Question (English)" },
    { key: "questionAr", label: "Question (Arabic)" },
    { key: "answer", label: "Answer (English)", type: "textarea" },
    { key: "answerAr", label: "Answer (Arabic)", type: "textarea" },
  ],
  settings: [
    { key: "businessName", label: "Business / display name (English)" },
    { key: "businessNameAr", label: "Business / display name (Arabic)" },
    { key: "bio", label: "Short bio (English)", type: "textarea" },
    { key: "bioAr", label: "Short bio (Arabic)", type: "textarea" },
    {
      key: "heroHeadline",
      label: "Hero headline (English, line breaks supported)",
      type: "textarea",
    },
    {
      key: "heroHeadlineAr",
      label: "Hero headline (Arabic, line breaks supported)",
      type: "textarea",
    },
    { key: "heroDescription", label: "Hero description (English)", type: "textarea" },
    { key: "heroDescriptionAr", label: "Hero description (Arabic)", type: "textarea" },
    { key: "heroImage", label: "Hero photograph", type: "image" },
    { key: "whatsapp", label: "WhatsApp number (international format)" },
    { key: "instagramUrl", label: "Instagram URL", type: "url" },
    { key: "mapsUrl", label: "Google Maps URL", type: "url" },
    { key: "footerUrl", label: "Marwanweb.dev portfolio URL", type: "url" },
  ],
};
export function AdminDashboard({ initial }: { initial: Data }) {
  const router = useRouter();
  const [data, setData] = useState(initial),
    [section, setSection] = useState<Collection | "overview">("overview"),
    [editing, setEditing] = useState<RecordData | null>(null),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const current = section === "overview" ? "packages" : section;
  const records = Array.isArray(data[current])
    ? (data[current] as RecordData[])
    : [];
  function changeSection(key: Collection | "overview") {
    setSection(key);
    setEditing(key === "settings" ? { ...data.settings } : null);
    setMessage("");
    setError("");
  }
  function newRecord() {
    setEditing(
      Object.fromEntries([
        ...fields[current].map((f) => [
          f.key,
          f.type === "list"
            ? []
            : f.type === "number" && f.key !== "rating"
              ? 0
              : "",
        ]),
        ["order", records.length],
        ["active", true],
      ]),
    );
    setError("");
    setMessage("");
  }
  async function mutate(record: RecordData, method = "POST") {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/${current}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (current === "settings") setData({ ...data, settings: result.record });
      else {
        const remaining = records.filter((r) => r._id !== record._id);
        if (method !== "DELETE") remaining.push(result.record);
        remaining.sort((a, b) => Number(a.order) - Number(b.order));
        setData({ ...data, [current]: remaining });
      }
      setEditing(current === "settings" ? result.record : null);
      setMessage(
        method === "DELETE"
          ? "Deleted successfully."
          : "Saved. Your website is up to date.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File | undefined, key: string) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setEditing((previous) => ({ ...previous, [key]: result.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="wordmark" href="/">
          <span>Makeup by Dima</span>
          <small>THE ARTIST’S STUDIO</small>
        </Link>
        <nav aria-label="Admin navigation">
          <button
            className={section === "overview" ? "active" : ""}
            onClick={() => changeSection("overview")}
          >
            Overview
          </button>
          {Object.entries(sections).map(([key, label]) => (
            <button
              className={section === key ? "active" : ""}
              key={key}
              onClick={() => changeSection(key as Collection)}
            >
              {label}
            </button>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noopener noreferrer">
          View website <ArrowUpRight size={16} />
        </a>
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const response = await fetch("/api/auth", { method: "DELETE" });
              if (!response.ok) throw new Error("Sign out failed");
              router.refresh();
            } catch {
              setError("Could not sign out. Please try again.");
              setBusy(false);
            }
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="admin-main">
        <p className="eyebrow">YOUR SPACE TO CREATE</p>
        <div className="admin-heading">
          <h1>
            {section === "overview"
              ? "Welcome to your studio."
              : sections[section]}
          </h1>
          {section !== "overview" && section !== "settings" && !editing && (
            <button className="button" onClick={newRecord}>
              <Plus size={17} /> Add new
            </button>
          )}
        </div>
        {message && (
          <p className="success-message" role="status">
            <Check size={18} />
            {message}
          </p>
        )}
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        {section === "overview" ? (
          <>
            <p>Every detail, beautifully in your hands.</p>
            <div className="stats-grid">
              {(
                [
                  "packages",
                  "portfolio",
                  "beforeAfter",
                  "testimonials",
                ] as const
              ).map((key) => (
                <button onClick={() => changeSection(key)} key={key}>
                  <span>
                    {key === "packages"
                      ? (data[key] as RecordData[]).filter((r) => r.active)
                          .length
                      : (data[key] as RecordData[]).length}
                  </span>
                  {key === "packages" ? "Active packages" : sections[key]}
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </div>
            <div className="admin-welcome">
              <h2>Make it yours.</h2>
              <p>
                Start with your contact details in Site settings, then add your
                favorite looks. Changes appear on your website as soon as you
                save.
              </p>
              <button
                className="button"
                onClick={() => changeSection("settings")}
              >
                Edit site settings <ArrowUpRight size={16} />
              </button>
            </div>
          </>
        ) : editing ? (
          <form
            className="editor"
            onSubmit={(e) => {
              e.preventDefault();
              void mutate(editing);
            }}
          >
            {fields[current].map((field) => (
              <label key={field.key}>
                {field.label}
                {field.type === "textarea" || field.type === "list" ? (
                  <textarea
                    rows={field.type === "list" ? 4 : 3}
                    value={
                      Array.isArray(editing[field.key])
                        ? (editing[field.key] as string[]).join("\n")
                        : String(editing[field.key] ?? "")
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        [field.key]:
                          field.type === "list"
                            ? e.target.value.split("\n")
                            : e.target.value,
                      })
                    }
                  />
                ) : (
                  <input
                    type={field.type === "image" ? "url" : field.type || "text"}
                    value={String(editing[field.key] ?? "")}
                    min={field.key === "rating" ? 1 : 0}
                    max={field.key === "rating" ? 5 : undefined}
                    step={field.key === "price" ? "0.01" : 1}
                    onChange={(e) =>
                      setEditing({ ...editing, [field.key]: e.target.value })
                    }
                  />
                )}
                {field.type === "image" && (
                  <>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading || busy}
                      onChange={(e) =>
                        void upload(e.target.files?.[0], field.key)
                      }
                    />
                    <small>
                      JPG, PNG, WebP · maximum 4 MB. Upload or paste a
                      Cloudinary URL.
                    </small>
                    {editing[field.key] ? (
                      <a
                        href={String(editing[field.key])}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview image ↗
                      </a>
                    ) : null}
                  </>
                )}
              </label>
            ))}
            {current !== "settings" && (
              <div className="editor-options">
                <label>
                  Display order
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    value={Number(editing.order)}
                    onChange={(e) =>
                      setEditing({ ...editing, order: Number(e.target.value) })
                    }
                  />
                  <small>Lower numbers appear first.</small>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.active)}
                    onChange={(e) =>
                      setEditing({ ...editing, active: e.target.checked })
                    }
                  />
                  Visible on website
                </label>
              </div>
            )}
            <div className="editor-actions">
              <button className="button" disabled={busy || uploading}>
                {uploading ? "Uploading…" : busy ? "Saving…" : "Save changes"}
              </button>
              {current !== "settings" && (
                <button
                  type="button"
                  className="button button-outline"
                  disabled={busy || uploading}
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="admin-list">
            {records.length === 0 ? (
              <div className="admin-empty">
                <h2>A fresh canvas.</h2>
                <p>
                  Add your first {sections[current].toLowerCase()} entry to get
                  started.
                </p>
                <button className="button" onClick={newRecord}>
                  Add new <Plus size={16} />
                </button>
              </div>
            ) : (
              records.map((record) => (
                <article key={String(record._id)}>
                  <span className="order-number">
                    {String(record.order).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>
                      {String(record.name || record.title || record.question)}
                    </h3>
                    <p>
                      {current === "packages" ? `$${record.price} · ` : ""}
                      {record.active ? "Visible" : "Hidden"}
                      {record.category ? ` · ${record.category}` : ""}
                    </p>
                  </div>
                  <button
                    aria-label={`Edit ${record.name || record.title || record.question}`}
                    onClick={() => {
                      setEditing({ ...record });
                      setError("");
                    }}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="delete-button"
                    disabled={busy}
                    aria-label={`Delete ${record.name || record.title || record.question}`}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Permanently delete this entry? This cannot be undone.",
                        )
                      )
                        void mutate(record, "DELETE");
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </article>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

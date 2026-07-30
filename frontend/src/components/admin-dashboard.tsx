"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Category, type Product } from "@/data/products";
import { formatNaira } from "@/lib/format";

const TOKEN_KEY = "andyhair_admin_token";

/** Fetch the catalogue from the app's own API (same origin). */
async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  if (!res.ok) return [];
  return (await res.json()) as Product[];
}

// The admin token lives in localStorage and is read via useSyncExternalStore so
// there is no SSR/hydration flash and no setState-in-effect.
const tokenListeners = new Set<() => void>();

function subscribeToken(cb: () => void): () => void {
  tokenListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    tokenListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function writeToken(value: string | null): void {
  if (value === null) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, value);
  tokenListeners.forEach((l) => l());
}

function useToken(): string | null {
  return useSyncExternalStore(
    subscribeToken,
    () => localStorage.getItem(TOKEN_KEY),
    () => null,
  );
}

interface FormState {
  category: Category;
  name: string;
  detail: string;
  description: string;
  lengths: string;
  price: string;
  oldPrice: string;
  badge: boolean;
  file: File | null;
}

const EMPTY_FORM: FormState = {
  category: CATEGORIES[0],
  name: "",
  detail: "",
  description: "",
  lengths: "",
  price: "",
  oldPrice: "",
  badge: false,
  file: null,
};

export function AdminDashboard() {
  const token = useToken();

  const saveToken = useCallback((next: string) => writeToken(next), []);
  const logout = useCallback(() => writeToken(null), []);

  return (
    <main className="min-h-screen bg-ivory px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-espresso">
              Andy Hair — Admin
            </h1>
            <p className="text-sm text-clay">Manage your product catalogue</p>
          </div>
          {token ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-espresso/15 px-4 py-2 text-sm font-semibold text-espresso transition hover:border-gold"
            >
              Log out
            </button>
          ) : (
            <Link href="/" className="text-sm font-semibold text-clay">
              ← Site
            </Link>
          )}
        </header>

        {token ? (
          <Manager token={token} onUnauthorized={logout} />
        ) : (
          <Login onLoggedIn={saveToken} />
        )}
      </div>
    </main>
  );
}

function Login({ onLoggedIn }: { onLoggedIn: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "Incorrect password" : "Login failed");
        return;
      }
      const data = (await res.json()) as { access_token: string };
      onLoggedIn(data.access_token);
    } catch {
      setError("Could not reach the server");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-sm ring-1 ring-champagne"
    >
      <label className="block text-sm font-semibold text-espresso">
        Admin password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          required
          className="mt-2 w-full rounded-lg border border-champagne px-3 py-2 text-espresso outline-none focus:border-gold"
        />
      </label>
      {error && <p className="mt-3 text-sm text-discount">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-full bg-espresso px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-cocoa disabled:opacity-60"
      >
        {busy ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

function Manager({
  token,
  onUnauthorized,
}: {
  token: string;
  onUnauthorized: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetchProducts().then((data) => {
      if (!active) return;
      setProducts(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  /** Fetch with the admin token; logs out on a 401. */
  const authFetch = useCallback(
    async (path: string, init: RequestInit = {}) => {
      const res = await fetch(`/api${path}`, {
        ...init,
        headers: { ...init.headers, Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onUnauthorized();
        throw new Error("Session expired — please log in again");
      }
      return res;
    },
    [token, onUnauthorized],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const lengths = form.lengths
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => Number.isFinite(n) && n > 0);
      if (lengths.length === 0) {
        setError("Enter at least one length, e.g. 16, 18, 20");
        return;
      }

      const payload: Record<string, unknown> = {
        category: form.category,
        name: form.name.trim(),
        detail: form.detail.trim(),
        description: form.description.trim(),
        lengths,
        price: Number(form.price),
      };
      if (form.oldPrice.trim()) payload.oldPrice = Number(form.oldPrice);
      if (form.badge) payload.badge = "New";

      const res = await authFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setError(await readError(res));
        return;
      }
      const created = (await res.json()) as { id: string };

      if (form.file) {
        const body = new FormData();
        body.append("file", form.file);
        const up = await authFetch(`/products/${created.id}/image`, {
          method: "POST",
          body,
        });
        if (!up.ok) {
          setError("Product saved, but the photo upload failed.");
          await refresh();
          return;
        }
      }

      setForm(EMPTY_FORM);
      setNotice("Product added.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function remove(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setError(null);
    setNotice(null);
    try {
      const res = await authFetch(`/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        setError(await readError(res));
        return;
      }
      setNotice("Product removed.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-champagne">
        <h2 className="font-display text-xl text-espresso">Add a product</h2>
        <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as Category)}
              className="w-full rounded-lg border border-champagne px-3 py-2 text-espresso outline-none focus:border-gold"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Name">
            <Input
              value={form.name}
              onChange={(v) => update("name", v)}
              required
              placeholder="Raw Vietnamese Bone Straight"
            />
          </Field>
          <Field label="Short detail line" full>
            <Input
              value={form.detail}
              onChange={(v) => update("detail", v)}
              required
              placeholder="12A grade · Double drawn · Full & flat"
            />
          </Field>
          <Field label="Description" full>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border border-champagne px-3 py-2 text-espresso outline-none focus:border-gold"
            />
          </Field>
          <Field label="Lengths (inches, comma-separated)" full>
            <Input
              value={form.lengths}
              onChange={(v) => update("lengths", v)}
              required
              placeholder="16, 18, 20, 22"
            />
          </Field>
          <Field label="Price (₦)">
            <Input
              value={form.price}
              onChange={(v) => update("price", v)}
              required
              type="number"
              placeholder="185000"
            />
          </Field>
          <Field label="Old price (₦, optional — for a discount)">
            <Input
              value={form.oldPrice}
              onChange={(v) => update("oldPrice", v)}
              type="number"
              placeholder="220000"
            />
          </Field>
          <Field label="Photo (optional)">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => update("file", e.target.files?.[0] ?? null)}
              className="w-full text-sm text-clay file:mr-3 file:rounded-full file:border-0 file:bg-espresso file:px-4 file:py-2 file:text-xs file:font-semibold file:text-ivory"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-espresso">
            <input
              type="checkbox"
              checked={form.badge}
              onChange={(e) => update("badge", e.target.checked)}
            />
            Mark as “New”
          </label>

          <div className="sm:col-span-2">
            {error && <p className="mb-3 text-sm text-discount">{error}</p>}
            {notice && (
              <p className="mb-3 text-sm font-medium text-whatsapp">{notice}</p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-espresso transition hover:bg-gold-light disabled:opacity-60"
            >
              {busy ? "Saving…" : "Add product"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-xl text-espresso">
          Products{" "}
          <span className="text-sm font-normal text-clay">
            ({products.length})
          </span>
        </h2>
        {loading ? (
          <p className="mt-4 text-clay">Loading…</p>
        ) : products.length === 0 ? (
          <p className="mt-4 text-clay">No products yet — add one above.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded-xl bg-white p-3 shadow-sm ring-1 ring-champagne"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-cocoa">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-espresso">
                    {p.name}
                  </p>
                  <p className="text-xs text-clay">
                    {p.category} · {formatNaira(p.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-discount transition hover:bg-discount/10"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`block text-sm font-semibold text-espresso ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      placeholder={placeholder}
      className="w-full rounded-lg border border-champagne px-3 py-2 font-normal text-espresso outline-none focus:border-gold"
    />
  );
}

/** Pull a human-readable message out of a Nest error response. */
async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(data.message)) return data.message.join(", ");
    if (data.message) return data.message;
  } catch {
    // fall through
  }
  return `Request failed (${res.status})`;
}

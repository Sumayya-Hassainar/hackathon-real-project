import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const categories = ['All', 'Repairs', 'Food', 'Learning', 'Rides', 'Garden'];

function App() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('All');
  const [kind, setKind] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadItems() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/opportunities?category=${encodeURIComponent(category)}`
      );

      if (!response.ok) {
        throw new Error('Could not load the neighborhood board.');
      }

      setItems(await response.json());
    } catch (err) {
      setError(`${err.message} Make sure the Node server is running.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [category]);

  const visibleItems = useMemo(
    () =>
      items.filter(
        (item) => kind === 'All' || item.kind === kind
      ),
    [items, kind]
  );

  async function createItem(form) {
    const response = await fetch('/api/opportunities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(
        payload.error || 'Could not post your good turn.'
      );
    }

    setItems((current) => [payload, ...current]);
    setShowForm(false);
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#f8f7f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          <a
            href="#top"
            className="flex items-center gap-2 text-xl font-black tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-lg text-white shadow-lg shadow-slate-900/10">
              ↗
            </span>
            <span>goodturn</span>
          </a>

          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-slate-300 hover:shadow-md">
            <span>⌖</span>
            Maplewood
            <span className="text-slate-400">⌄</span>
          </button>
        </div>
      </header>

      <main id="top">

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-slate-200/70">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">

            <div className="relative z-10">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.15em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                A GOOD NEIGHBORHOOD STARTS HERE
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-8xl">
                Small help.
                <br />
                <span className="text-emerald-600">Big difference.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                Share what you know. Ask for what you need.
                Good things happen close to home.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-slate-950 px-6 py-3.5 font-bold text-white shadow-xl shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-600"
              >
                Make a good turn
                <span className="transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </button>
            </div>

            {/* HERO VISUAL */}
            <div className="relative hidden h-[420px] lg:block">

              <div className="absolute right-5 top-10 h-72 w-72 rounded-full bg-emerald-200/60 blur-2xl" />

              <div className="absolute right-16 top-12 h-64 w-64 rounded-full border-[2px] border-emerald-300/70" />

              <div className="absolute right-2 top-28 h-64 w-64 rounded-full border-[2px] border-dashed border-amber-300/80" />

              <div className="absolute right-32 top-24 flex h-28 w-28 items-center justify-center rounded-full bg-amber-300 text-5xl shadow-xl shadow-amber-300/30">
                ☀
              </div>

              <div className="absolute bottom-16 left-10 rounded-3xl border border-white bg-white/80 p-5 shadow-xl backdrop-blur">
                <div className="mb-3 flex -space-x-3">
                  {['🙂', '👩', '👨', '🧑'].map((person, index) => (
                    <div
                      key={index}
                      className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-xl"
                    >
                      {person}
                    </div>
                  ))}
                </div>

                <p className="font-bold text-slate-900">
                  Your neighbors
                </p>

                <p className="text-sm text-slate-500">
                  are pretty great.
                </p>
              </div>

              <div className="absolute bottom-12 right-10 text-7xl">
                🌱
              </div>

              <div className="absolute right-12 top-8 text-5xl text-rose-400">
                ♡
              </div>
            </div>
          </div>
        </section>

        {/* BOARD */}
        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <span className="text-xs font-black tracking-[0.18em] text-emerald-600">
                THE NEIGHBORHOOD BOARD
              </span>

              <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Around your corner
              </h2>
            </div>

            {/* KIND FILTER */}
            <div className="inline-flex w-fit rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
              {['All', 'Ask', 'Offer'].map((value) => (
                <button
                  key={value}
                  onClick={() => setKind(value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                    kind === value
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {value === 'Ask'
                    ? '♡ Asks'
                    : value === 'Offer'
                    ? '✦ Offers'
                    : 'Everything'}
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="mt-8 flex flex-wrap items-center gap-2">

            {categories.map((value) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  category === value
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-950'
                }`}
              >
                {value}
              </button>
            ))}

            <span className="ml-auto text-sm font-semibold text-slate-400">
              {visibleItems.length}{' '}
              {visibleItems.length === 1 ? 'good turn' : 'good turns'}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="font-bold text-red-800">
                Something went wrong
              </div>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={loadItems}
                className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {/* LOADING */}
          {loading && !error && (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-3xl bg-white shadow-sm"
                />
              ))}

            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !error &&
            visibleItems.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600">
                  ✿
                </div>

                <h3 className="mt-5 text-2xl font-black">
                  Room for a good turn
                </h3>

                <p className="mx-auto mt-2 max-w-md text-slate-500">
                  Nothing here just yet. Be the first neighbor to post.
                </p>

                <button
                  onClick={() => setShowForm(true)}
                  className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-emerald-600"
                >
                  Post the first one ↗
                </button>
              </div>
            )}

          {/* CARDS */}
          {!loading &&
            !error &&
            visibleItems.length > 0 && (
              <section className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {visibleItems.map((item) => (
                  <TurnCard key={item.id} item={item} />
                ))}

              </section>
            )}

          <footer className="mt-20 flex flex-col gap-3 border-t border-slate-200 pt-7 text-sm text-slate-400 sm:flex-row sm:justify-between">
            <span>Made for neighbors, by neighbors.</span>

            <span>
              with a little{' '}
              <b className="text-rose-500">♥</b>
            </span>
          </footer>
        </section>
      </main>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-5 z-30 flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 font-bold text-white shadow-2xl shadow-emerald-600/30 transition hover:-translate-y-1 hover:bg-emerald-700 sm:right-8"
      >
        <span className="text-xl">＋</span>
        Post a good turn
      </button>

      {showForm && (
        <PostModal
          onClose={() => setShowForm(false)}
          onSubmit={createItem}
        />
      )}
    </div>
  );
}

function TurnCard({ item }) {
  const offer = item.kind === 'Offer';

  return (
    <article className="group flex min-h-[260px] flex-col rounded-[1.7rem] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">

      <div className="flex items-center justify-between gap-3">

        <span
          className={`rounded-full px-3 py-1.5 text-[11px] font-black tracking-wider ${
            offer
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-rose-50 text-rose-600'
          }`}
        >
          {offer ? '✦ OFFER' : '♡ ASK'}
        </span>

        <span className="text-xs font-bold text-slate-400">
          {item.category}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-black leading-snug text-slate-950">
        {item.title}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
        {item.description}
      </p>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5">

        <span className="flex min-w-0 items-center gap-2 truncate text-xs font-semibold text-slate-400">
          <span>⌖</span>
          {item.neighborhood}
        </span>

        <a
          className="shrink-0 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-900 transition group-hover:bg-slate-950 group-hover:text-white"
          href={`mailto:${encodeURIComponent(
            item.contact
          )}?subject=${encodeURIComponent(
            `GoodTurn: ${item.title}`
          )}`}
        >
          Connect ↗
        </a>

      </div>
    </article>
  );
}

function PostModal({ onClose, onSubmit }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    kind: 'Ask',
    title: '',
    description: '',
    category: 'Repairs',
    neighborhood: 'Maplewood',
    contact: '',
  });

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >

        <button
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <span className="text-xs font-black tracking-[0.18em] text-emerald-600">
          GOOD THINGS START SMALL
        </span>

        <h2
          id="modal-title"
          className="mt-3 max-w-lg text-3xl font-black tracking-tight sm:text-4xl"
        >
          Put a good turn out there
        </h2>

        <p className="mt-3 text-slate-500">
          A little detail helps the right neighbor find you.
        </p>

        <form
          onSubmit={submit}
          className="mt-7 space-y-5"
        >

          {/* ASK / OFFER */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5">

            {['Ask', 'Offer'].map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => update('kind', value)}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  form.kind === value
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {value === 'Ask'
                  ? '♡ I need a hand'
                  : '✦ I can help'}
              </button>
            ))}

          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">
              Headline
            </span>

            <input
              value={form.title}
              maxLength="72"
              onChange={(e) =>
                update('title', e.target.value)
              }
              placeholder="A clear, friendly headline"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">
              Tell us a little more
            </span>

            <textarea
              value={form.description}
              maxLength="500"
              rows="4"
              onChange={(e) =>
                update('description', e.target.value)
              }
              placeholder="What would you like neighbors to know?"
              required
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">

            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                Category
              </span>

              <select
                value={form.category}
                onChange={(e) =>
                  update('category', e.target.value)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-500 focus:bg-white"
              >
                {categories.slice(1).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold">
                Neighborhood
              </span>

              <input
                value={form.neighborhood}
                onChange={(e) =>
                  update('neighborhood', e.target.value)
                }
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </label>

          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold">
              Contact email
            </span>

            <input
              type="email"
              value={form.contact}
              onChange={(e) =>
                update('contact', e.target.value)
              }
              placeholder="you@example.com"
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>

          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            className="w-full rounded-2xl bg-slate-950 px-5 py-4 font-bold text-white shadow-xl transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={saving}
          >
            {saving
              ? 'Sharing…'
              : 'Share with neighbors ↗'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Your contact email is visible to people who can access the board.
          </p>

        </form>
      </section>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
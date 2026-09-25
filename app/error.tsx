"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="status-page">
      <p className="eyebrow">MAKEUP BY DIMA</p>
      <h1>A little beauty break.</h1>
      <p>We couldn’t load the website. Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

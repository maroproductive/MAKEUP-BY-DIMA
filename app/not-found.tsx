import Link from "next/link";
export default function NotFound() {
  return (
    <main className="status-page">
      <p className="eyebrow">404</p>
      <h1>A little off the beaten path.</h1>
      <Link className="button" href="/">
        Back to home
      </Link>
    </main>
  );
}

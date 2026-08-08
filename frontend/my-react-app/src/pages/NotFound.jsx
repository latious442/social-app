import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-line">404</h1>
      <p className="text-xl text-ink mt-4">Page not found</p>
      <p className="text-muted mt-2">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-6 bg-accent text-paper py-2 px-4 rounded hover:bg-accent-dark"
      >
        Go to Home
      </Link>
    </div>
  );
}

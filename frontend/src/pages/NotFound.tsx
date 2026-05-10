import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__message">Page not found</p>
      <Link to="/" className="not-found__link">← Back to home</Link>
    </div>
  );
}

import { Link } from 'react-router';
export function NotFound() { return <div className="panel empty-state"><h2>Page not found</h2><p>The requested dashboard page does not exist.</p><Link to="/" className="button primary">Back to overview</Link></div>; }

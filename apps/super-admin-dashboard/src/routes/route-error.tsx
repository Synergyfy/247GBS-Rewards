import { isRouteErrorResponse, useRouteError } from 'react-router';
export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : 'The requested page could not be loaded.';
  return <main className="main-content"><div className="panel empty-state"><h1 className="page-title">Something went wrong</h1><p>{message}</p><a className="button primary" href="/">Return to overview</a></div></main>;
}

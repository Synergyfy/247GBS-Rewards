import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/display/States';

/** Router errorElement: a failed lazy chunk or an unexpected render error. */
export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'The requested page could not be loaded.';
  return (
    <main className="main-content">
      <div className="panel">
        <EmptyState
          title="Something went wrong"
          description={message}
          action={
            <Button asChild>
              {/* Full reload: recovers from a stale lazy chunk after a deploy */}
              <a href="/">Return to overview</a>
            </Button>
          }
        />
      </div>
    </main>
  );
}

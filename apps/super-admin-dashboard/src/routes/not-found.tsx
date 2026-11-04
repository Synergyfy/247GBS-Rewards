import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/display/States';

export function NotFound() {
  return (
    <div className="panel">
      <EmptyState
        title="Page not found"
        description="The requested dashboard page does not exist."
        action={
          <Button asChild>
            <Link to="/">Back to overview</Link>
          </Button>
        }
      />
    </div>
  );
}

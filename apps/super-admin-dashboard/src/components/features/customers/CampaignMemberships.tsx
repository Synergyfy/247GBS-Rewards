import { Link } from 'react-router';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { CustomerMembership } from '@/services/types';

/**
 * Table cell for a customer's campaigns: the most recent one by name, plus a "+N" button that opens
 * every campaign with its own balance. A popover (not a hover card) so it also works on touch.
 */
export function CampaignMemberships({ memberships }: { memberships: CustomerMembership[] }) {
  const [latest, ...others] = memberships;
  if (!latest) return <span className="text-muted-foreground">—</span>;

  const name = (membership: CustomerMembership) =>
    membership.campaign ? (
      <Link className="inline-link" to={`/campaigns/${membership.campaign.id}`}>
        {membership.campaign.name}
      </Link>
    ) : (
      <span className="text-muted-foreground">Removed campaign</span>
    );

  return (
    <span className="inline-flex max-w-full items-center gap-1.5">
      <span className="min-w-0 truncate">{name(latest)}</span>
      {others.length > 0 && (
        <Popover>
          <PopoverTrigger
            className="shrink-0 rounded-sm border border-border bg-muted px-1.5 text-[11px] leading-[18px] font-medium text-muted-foreground tabular-nums transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            aria-label={`Show all ${memberships.length} campaigns`}
          >
            +{others.length}
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-0">
            <div className="border-b border-border px-3 py-2 text-xs font-medium">
              {memberships.length} campaigns
            </div>
            <ul className="max-h-64 overflow-y-auto py-1">
              {memberships.map((membership) => (
                <li key={membership.id} className="flex items-center justify-between gap-3 px-3 py-1.5 text-xs">
                  <span className="min-w-0 truncate">{name(membership)}</span>
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {membership.balance.toLocaleString()} pts
                  </span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </span>
  );
}


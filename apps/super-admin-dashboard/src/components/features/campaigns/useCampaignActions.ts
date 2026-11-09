import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superAdminApi } from '@/services';
import { SEASON_WARNING } from '@/services/hooks';
import type { Campaign } from '@/services/types';

type CampaignRef = Pick<Campaign, 'id' | 'name' | 'isActive'>;

/** §9B: campaign activation is reversible, so it runs immediately with a 6s Undo toast (single or bulk). */
export function useCampaignActions() {
  const client = useQueryClient();

  async function apply(campaigns: CampaignRef[], isActive: boolean) {
    const results = await Promise.all(campaigns.map((campaign) => superAdminApi.setCampaignStatus(campaign.id, isActive)));
    await Promise.all([
      client.invalidateQueries({ queryKey: ['campaigns'] }),
      ...campaigns.map((campaign) => client.invalidateQueries({ queryKey: ['campaign', campaign.id] })),
    ]);
    return results;
  }

  async function setStatus(campaigns: CampaignRef[], isActive: boolean) {
    const changed = campaigns.filter((campaign) => (campaign.isActive ?? true) !== isActive);
    if (!changed.length) {
      toast.info(isActive ? 'Already active' : 'Already inactive');
      return;
    }
    try {
      const results = await apply(changed, isActive);
      // Activating a seasonal campaign outside its season saves the flag but it stays inactive
      if (isActive && results.some((campaign) => !campaign.isActive)) toast.warning(SEASON_WARNING);
      const label = changed.length === 1 ? changed[0]!.name : `${changed.length} campaigns`;
      toast.success(`${label} ${isActive ? 'activated' : 'deactivated'}`, {
        duration: 6000,
        className: 'toast-undo',
        action: {
          label: 'Undo',
          onClick: () => {
            void apply(changed, !isActive)
              .then(() => toast.success('Previous status restored'))
              .catch(() => toast.error('Could not restore the previous status.'));
          },
        },
      });
    } catch (error) {
      toast.error(error instanceof Error && error.message ? error.message : 'Could not update campaign status.');
    }
  }

  return { setStatus };
}

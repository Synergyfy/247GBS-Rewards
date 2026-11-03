import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { superAdminApi } from '@/services';
import type { Campaign } from '@/services/types';

type CampaignRef = Pick<Campaign, 'id' | 'name' | 'isActive'>;

/** §9B: campaign activation is reversible, so it runs immediately with a 6s Undo toast (single or bulk). */
export function useCampaignActions() {
  const client = useQueryClient();

  async function apply(campaigns: CampaignRef[], isActive: boolean) {
    await Promise.all(campaigns.map((campaign) => superAdminApi.setCampaignStatus(campaign.id, isActive)));
    await Promise.all([
      client.invalidateQueries({ queryKey: ['campaigns'] }),
      ...campaigns.map((campaign) => client.invalidateQueries({ queryKey: ['campaign', campaign.id] })),
    ]);
  }

  async function setStatus(campaigns: CampaignRef[], isActive: boolean) {
    const changed = campaigns.filter((campaign) => (campaign.isActive ?? true) !== isActive);
    if (!changed.length) {
      toast.info(isActive ? 'Already active' : 'Already inactive');
      return;
    }
    try {
      await apply(changed, isActive);
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
    } catch {
      toast.error('Could not update campaign status.');
    }
  }

  return { setStatus };
}

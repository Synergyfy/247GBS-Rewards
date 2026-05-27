import { resetContact } from '@/store/features/businessContact';
import { resetGeneral } from '@/store/features/businessGeneral';
import { resetLinks } from '@/store/features/businessLink';
import { resetSocial } from '@/store/features/businessSocials';
import { useDispatch } from 'react-redux';

export const useClearBusinessStore = () => {
  const dispatch = useDispatch();
  dispatch(resetGeneral());
  dispatch(resetContact());
  dispatch(resetLinks());
  dispatch(resetSocial());
};
